

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import List
from datetime import datetime

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/newstories.json"
STORY_DETAILS_URL = "https://hacker-news.firebaseio.com/v0/item/{}.json"


def fetch_top_stories(limit: int = 10) -> List[dict]:
    try:
        # Fetch the list of top story IDs
        response = requests.get(TOP_STORIES_URL)
        response.raise_for_status()
        story_ids = response.json()[:limit]
        
        stories = []
        for story_id in story_ids:
            story_response = requests.get(STORY_DETAILS_URL.format(story_id))
            story_response.raise_for_status()
            story_data = story_response.json()
            stories.append({
                "title": story_data.get("title"),
                "author": story_data.get("by"),
                "url": story_data.get("url"),
                "score": story_data.get("score"),
                "time": datetime.fromtimestamp(story_data.get("time")).strftime('%Y-%m-%d %H:%M:%S'),
            })
        return stories
    
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail="HackerNews API is currently unreachable") from e

@app.get("/top-stories", response_model=List[dict])
def get_top_stories(limit: int = 10):
    return fetch_top_stories(limit)

