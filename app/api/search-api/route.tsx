import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
  const { searchInput, searchType } = await request.json();
  if (searchInput) {
    // const result = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.CX}&q=${searchInput}`)
    // console.log(result.data)
    // return NextResponse.json(result.data)
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX_ID = process.env.CX;
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!GOOGLE_API_KEY || !GOOGLE_CX_ID || !YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "Missing API keys in environment" },
        { status: 500 }
      );
    }

    // Prepare API endpoints
    const webSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchInput
    )}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX_ID}`;

    const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchInput
    )}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX_ID}&searchType=image`;

    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchInput
    )}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;

    // Run API calls in parallel
    const [webRes, imgRes, ytRes] = await Promise.all([
      axios.get(webSearchUrl),
      axios.get(imageSearchUrl),
      axios.get(youtubeSearchUrl),
    ]);

    if (!webRes.data || !imgRes.data || !ytRes.data) {
      return NextResponse.json(
        { error: "Failed to fetch one or more sources" },
        { status: 500 }
      );
    }

    const [webJson, imgJson, ytJson] = await Promise.all([
      webRes.data,
      imgRes.data,
      ytRes.data,
    ]);

    // Normalize responses
    const webResults = (webJson.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));

    const imageResults = (imgJson.items || []).map((item: any) => ({
      title: item.title,
      imageUrl: item.link,
      thumbnail: item.image?.thumbnailLink,
      contextLink: item.image?.contextLink,
    }));

    const videoResults = (ytJson.items || []).map((item: any) => ({
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    // console.log(webResults)
    // console.log(imageResults)
    // console.log(videoResults)

    return NextResponse.json({
      searchInput,
      webResults,
      imageResults,
      videoResults,
    });
  } else {
    return NextResponse.json({ error: "No search input provided" });
  }
}
