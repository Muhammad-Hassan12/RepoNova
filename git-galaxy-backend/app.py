import os
import re
import time
import requests
import concurrent.futures
from flask import Flask, jsonify, request as flask_request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
from cachetools import TTLCache
from dotenv import load_dotenv

# Initialize environment variables
load_dotenv()

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Environment variables
GITHUB_TOKEN = os.getenv("GITHUB_PAT")
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
GITHUB_REST_URL = "https://api.github.com"
PORT = int(os.getenv("PORT", 8000))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_origins.split(",")]
CORS(app, origins=allowed_origins)

# Rate Limiting
limiter = Limiter(get_remote_address, app=app, default_limits=["60 per minute"])

_cache = TTLCache(maxsize=1000, ttl=120)

def cache_get(key: str):
    return _cache.get(key)

def cache_set(key: str, data):
    _cache[key] = data

# Language Color Map
LANGUAGE_COLORS = {
    "Python": "#3572A5",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Java": "#b07219",
    "C++": "#f34b7d",
    "C": "#555555",
    "C#": "#178600",
    "Go": "#00ADD8",
    "Rust": "#dea584",
    "Ruby": "#701516",
    "PHP": "#4F5D95",
    "Swift": "#F05138",
    "Kotlin": "#A97BFF",
    "Dart": "#00B4AB",
    "Jupyter Notebook": "#DA5B0B",
    "Shell": "#89e051",
    "Lua": "#000080",
    "R": "#198CE7",
    "Scala": "#c22d40",
    "Vue": "#41b883",
    "Svelte": "#ff3e00",
}

# Input Validation
USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,37}[a-zA-Z0-9])?$")

def is_valid_username(username: str) -> bool:
    return bool(USERNAME_REGEX.match(username))

# GitHub API Headers
def get_github_headers():
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json",
    }

# GraphQL
def fetch_all_repos(username: str):
    """Fetches up to 400 unique repos using concurrent GraphQL requests to bypass sequential cursor limits."""
    query = """
    query ($login: String!, $orderField: RepositoryOrderField!) {
      user(login: $login) {
        repositories(first: 100, orderBy: {field: $orderField, direction: DESC}, isFork: false) {
          nodes {
            name
            description
            stargazerCount
            forkCount
            updatedAt
            primaryLanguage {
              name
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
            pullRequests(states: OPEN) {
              totalCount
            }
            issues(states: OPEN) {
              totalCount
            }
          }
        }
      }
    }
    """

    order_fields = ["PUSHED_AT", "STARGAZERS", "CREATED_AT", "UPDATED_AT"]
    all_repos_dict = {}
    max_retries = 3

    # Use a shared session to reuse TCP connections
    session = requests.Session()
    session.headers.update(get_github_headers())

    def _fetch_view(order_field):
        variables = {"login": username, "orderField": order_field}
        response = None
        last_status = None
        
        for attempt in range(max_retries):
            try:
                response = session.post(
                    GITHUB_GRAPHQL_URL,
                    json={"query": query, "variables": variables},
                    timeout=20,
                )
                if response.status_code in (502, 503):
                    last_status = response.status_code
                    time.sleep(1 + attempt) # Simple backoff
                    continue
                break
            except requests.exceptions.Timeout:
                last_status = "timeout"
                if attempt < max_retries - 1:
                    time.sleep(1 + attempt)
                    continue
                return None, "GitHub API request timed out."
            except requests.exceptions.ConnectionError:
                last_status = "connection_error"
                if attempt < max_retries - 1:
                    time.sleep(1 + attempt)
                    continue
                return None, "Failed to connect to GitHub API."
            except Exception as e:
                return None, str(e)

        if response is None:
            return None, f"Failed after retries (last: {last_status})"

        if response.status_code != 200:
            return None, f"Status {response.status_code}"

        data = response.json()

        if "errors" in data:
            error_msg = data["errors"][0].get("message", "Unknown GraphQL error")
            if "Could not resolve to a User" in error_msg:
                return None, "USER_NOT_FOUND"
            return None, error_msg

        user_data = data.get("data", {}).get("user")
        if not user_data:
            return None, "USER_NOT_FOUND"

        return user_data.get("repositories", {}).get("nodes", []), None

    # Fetch 4 pages simultaneously (up to 400 repos)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        future_to_order = {executor.submit(_fetch_view, field): field for field in order_fields}
        
        for future in concurrent.futures.as_completed(future_to_order):
            nodes, error = future.result()
            
            if error == "USER_NOT_FOUND":
                return None, "USER_NOT_FOUND"
                
            if nodes:
                for node in nodes:
                    if node and node.get("name"):
                        all_repos_dict[node["name"]] = node

    return list(all_repos_dict.values()), None

# GraphQL: Fetch contribution calendar
def fetch_contributions(username: str):
    """Fetches the contribution calendar for the last year."""
    query = """
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
    """

    response = requests.post(
        GITHUB_GRAPHQL_URL,
        json={"query": query, "variables": {"login": username}},
        headers=get_github_headers(),
        timeout=15,
    )

    if response.status_code != 200:
        return None, f"GitHub API returned status {response.status_code}"

    data = response.json()

    if "errors" in data:
        error_msg = data["errors"][0].get("message", "Unknown error")
        if "Could not resolve to a User" in error_msg:
            return None, "USER_NOT_FOUND"
        return None, error_msg

    user_data = data.get("data", {}).get("user")
    if not user_data:
        return None, "USER_NOT_FOUND"

    calendar = (
        user_data
        .get("contributionsCollection", {})
        .get("contributionCalendar", {})
    )

    return calendar, None


# ===================== API ROUTES =====================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "online",
        "engine": "Cosmic Engine v2.0",
        "token_configured": bool(GITHUB_TOKEN and GITHUB_TOKEN != "your_github_pat_here"),
    })


@app.route("/api/galaxy/<username>", methods=["GET"])
@limiter.limit("30 per minute")
def get_galaxy_data(username):
    """Main galaxy data endpoint with caching, validation, and pagination."""

    # Validate token
    if not GITHUB_TOKEN or GITHUB_TOKEN == "your_github_pat_here":
        return jsonify({"error": "Cosmic Engine Error: GitHub PAT is missing in your .env file!"}), 500

    # Validate username
    if not is_valid_username(username):
        return jsonify({"error": f"Invalid GitHub username: '{username}'. Only alphanumeric characters and hyphens are allowed."}), 400

    # Check cache
    cache_key = f"galaxy:{username.lower()}"
    cached = cache_get(cache_key)
    if cached:
        return jsonify(cached)

    # Fetch from GitHub
    repos, error = fetch_all_repos(username)

    if error == "USER_NOT_FOUND":
        return jsonify({"error": f"GitHub user '{username}' not found. Check the username and try again."}), 404

    if error:
        return jsonify({"error": f"Failed to fetch data from GitHub: {error}"}), 502

    if repos is None:
        return jsonify({"error": "An unexpected error occurred while fetching data."}), 500

    # Transforming repos into celestial bodies
    celestial_bodies = []

    for repo in repos:
        repo_name = repo.get("name", "Unknown System")
        stars = repo.get("stargazerCount", 0)
        forks = repo.get("forkCount", 0)
        description = repo.get("description", "")
        updated_at = repo.get("updatedAt", "")

        lang_node = repo.get("primaryLanguage")
        language = lang_node.get("name") if lang_node else "Unknown"
        color = LANGUAGE_COLORS.get(language, "#ffffff")

        commits = 0
        branch = repo.get("defaultBranchRef")
        if branch and branch.get("target") and branch["target"].get("history"):
            commits = branch["target"]["history"].get("totalCount", 0)

        open_prs = 0
        prs_node = repo.get("pullRequests")
        if prs_node:
            open_prs = prs_node.get("totalCount", 0)

        open_issues = 0
        issues_node = repo.get("issues")
        if issues_node:
            open_issues = issues_node.get("totalCount", 0)

        celestial_bodies.append({
            "repo_name": repo_name,
            "description": description or "",
            "language": language,
            "color": color,
            "mass": max(5, stars * 2),
            "orbiting_particles": commits,
            "open_prs": open_prs,
            "open_issues": open_issues,
            "forks": forks,
            "stars": stars,
            "updated_at": updated_at,
        })

    result = {
        "username": username,
        "engine_status": "Online - Live Data Mode",
        "message": f"Live GitHub universe mapped for {username}!",
        "total_repos": len(celestial_bodies),
        "celestial_bodies": celestial_bodies,
    }

    # Cache result
    cache_set(cache_key, result)

    return jsonify(result)


@app.route("/api/contributions/<username>", methods=["GET"])
@limiter.limit("30 per minute")
def get_contributions(username):
    """Contribution calendar endpoint for the Nebula feature."""

    if not GITHUB_TOKEN or GITHUB_TOKEN == "your_github_pat_here":
        return jsonify({"error": "GitHub PAT is missing."}), 500

    if not is_valid_username(username):
        return jsonify({"error": f"Invalid username: '{username}'."}), 400

    # Check cache
    cache_key = f"contributions:{username.lower()}"
    cached = cache_get(cache_key)
    if cached:
        return jsonify(cached)

    calendar, error = fetch_contributions(username)

    if error == "USER_NOT_FOUND":
        return jsonify({"error": f"User '{username}' not found."}), 404
    if error:
        return jsonify({"error": f"Failed to fetch contributions: {error}"}), 502

    result = {
        "username": username,
        "total_contributions": calendar.get("totalContributions", 0),
        "weeks": calendar.get("weeks", []),
    }

    cache_set(cache_key, result)
    return jsonify(result)


# GraphQL: Fetch user profile
def fetch_user_profile(username: str):
    """Fetches user profile information."""
    query = """
    query ($login: String!) {
      user(login: $login) {
        avatarUrl
        name
        bio
        company
        location
        followers {
          totalCount
        }
        following {
          totalCount
        }
      }
    }
    """

    response = requests.post(
        GITHUB_GRAPHQL_URL,
        json={"query": query, "variables": {"login": username}},
        headers=get_github_headers(),
        timeout=15,
    )

    if response.status_code != 200:
        return None, f"GitHub API returned status {response.status_code}"

    data = response.json()

    if "errors" in data:
        error_msg = data["errors"][0].get("message", "Unknown error")
        if "Could not resolve to a User" in error_msg:
            return None, "USER_NOT_FOUND"
        return None, error_msg

    user_data = data.get("data", {}).get("user")
    if not user_data:
        return None, "USER_NOT_FOUND"

    return user_data, None


@app.route("/api/user/<username>", methods=["GET"])
@limiter.limit("30 per minute")
def get_user_profile(username):
    """User profile endpoint for the Profile Card."""

    if not GITHUB_TOKEN or GITHUB_TOKEN == "your_github_pat_here":
        return jsonify({"error": "GitHub PAT is missing."}), 500

    if not is_valid_username(username):
        return jsonify({"error": f"Invalid username: '{username}'."}), 400

    # Check cache
    cache_key = f"user:{username.lower()}"
    cached = cache_get(cache_key)
    if cached:
        return jsonify(cached)

    user_data, error = fetch_user_profile(username)

    if error == "USER_NOT_FOUND":
        return jsonify({"error": f"User '{username}' not found."}), 404
    if error:
        return jsonify({"error": f"Failed to fetch user profile: {error}"}), 502

    result = {
        "username": username,
        "avatar_url": user_data.get("avatarUrl", ""),
        "name": user_data.get("name", ""),
        "bio": user_data.get("bio", ""),
        "company": user_data.get("company", ""),
        "location": user_data.get("location", ""),
        "followers": user_data.get("followers", {}).get("totalCount", 0),
        "following": user_data.get("following", {}).get("totalCount", 0),
    }

    cache_set(cache_key, result)
    return jsonify(result)


@app.route("/api/rate-limit", methods=["GET"])
def get_rate_limit():
    """Returns remaining GitHub API rate limit info."""
    if not GITHUB_TOKEN:
        return jsonify({"error": "No token configured."}), 500

    response = requests.get(
        f"{GITHUB_REST_URL}/rate_limit",
        headers={"Authorization": f"Bearer {GITHUB_TOKEN}"},
        timeout=10,
    )

    if response.status_code == 200:
        data = response.json()
        graphql = data.get("resources", {}).get("graphql", {})
        return jsonify({
            "limit": graphql.get("limit", 0),
            "remaining": graphql.get("remaining", 0),
            "reset_at": graphql.get("reset", 0),
        })

    return jsonify({"error": "Could not fetch rate limit info."}), 502


if __name__ == "__main__":
    app.run(debug=FLASK_DEBUG, port=PORT)