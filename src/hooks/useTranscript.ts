
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TranscriptSegment } from "@/types/course";

// Helper function to convert Mux transcript format to our app format
const convertMuxTranscriptToSegments = (muxTranscript: any): TranscriptSegment[] => {
  if (!muxTranscript || !muxTranscript.words) {
    return [];
  }

  const segments: TranscriptSegment[] = [];
  
  let lastWordEnd = 0;
  let currentSentence = "";
  let sentenceStartTime = 0;
  let wordCount = 0;
  const MAX_WORDS_PER_SEGMENT = 15; // Maximum words per segment for readability
  
  // Process only word type entries (skip spacing)
  muxTranscript.words.forEach((item: any, index: number) => {
    if (item.type === "word") {
      // Create a new segment if:
      // 1. This is the first word, OR
      // 2. There's a pause of more than 0.5 seconds, OR
      // 3. We've reached the maximum word count for a segment
      if (index === 0 || 
          item.start - lastWordEnd > 0.5 || 
          wordCount >= MAX_WORDS_PER_SEGMENT) {
          
        // Save the current sentence if it's not empty
        if (currentSentence.length > 0) {
          segments.push({
            text: currentSentence.trim(),
            startTime: sentenceStartTime,
            endTime: lastWordEnd
          });
        }
        
        // Start a new sentence
        currentSentence = item.text;
        sentenceStartTime = item.start;
        wordCount = 1;
      } else {
        // Add to the current sentence
        currentSentence += " " + item.text;
        wordCount++;
      }
      
      lastWordEnd = item.end;
    }
  });
  
  // Add the last segment if it has content
  if (currentSentence.length > 0) {
    segments.push({
      text: currentSentence.trim(),
      startTime: sentenceStartTime,
      endTime: lastWordEnd
    });
  }
  
  // Further refine segments - merge very short segments with the next one
  const refinedSegments: TranscriptSegment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const currentSegment = segments[i];
    const nextSegment = i < segments.length - 1 ? segments[i + 1] : null;
    
    // If current segment is very short and there's a next segment close in time
    if (currentSegment.text.split(' ').length <= 3 && nextSegment && 
        nextSegment.startTime - currentSegment.endTime < 0.3) {
      // If there's a next segment, merge with it and skip the next iteration
      if (nextSegment) {
        nextSegment.text = currentSegment.text + " " + nextSegment.text;
        nextSegment.startTime = currentSegment.startTime;
        continue; // Skip adding this segment separately
      }
    }
    
    refinedSegments.push(currentSegment);
  }
  
  return refinedSegments;
};

// Process and store transcript in the database
export async function processAndStoreTranscript(playbackId: string, transcriptSourceFile: string): Promise<TranscriptSegment[]> {
  try {
    console.log(`Processing transcript for playback ID: ${playbackId} from source: ${transcriptSourceFile}`);
    
    // Try to fetch from the database first
    const { data: existingData, error: fetchError } = await supabase
      .from("transcripts")
      .select("*")
      .eq("playback_id", playbackId)
      .single();
    
    // If transcript already exists in database, return its segments
    if (existingData && existingData.segments && Array.isArray(existingData.segments) && existingData.segments.length > 0) {
      console.log("Transcript already exists in database, returning segments");
      return existingData.segments.map((segment: any) => ({
        text: segment.text || "",
        startTime: Number(segment.startTime) || 0,
        endTime: Number(segment.endTime) || 0
      }));
    }
    
    // If not in database, try to load from local file
    try {
      // Dynamic import of the transcript file
      const response = await fetch(`/src/components/trans/${transcriptSourceFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transcript file: ${response.statusText}`);
      }
      
      const rawData = await response.json();
      console.log("Loaded raw transcript data from file");
      
      // Process the transcript data
      const segments = convertMuxTranscriptToSegments(rawData);
      console.log(`Processed ${segments.length} transcript segments`);
      
      if (segments.length > 0) {
        // Store in database
        const result = await updateTranscript(playbackId, segments, rawData, "pl");
        console.log("Stored transcript in database:", result);
        
        return segments;
      }
    } catch (fileError) {
      console.error("Error loading transcript file:", fileError);
    }
    
    return [];
  } catch (error) {
    console.error("Error in processAndStoreTranscript:", error);
    return [];
  }
}

// Function to get local transcript from src/trans/*.json files
const getLocalTranscript = (playbackId: string | undefined, sourceFile?: string): TranscriptSegment[] => {
  // Local transcripts have been removed
  console.log("Local transcripts are no longer available");
  return [];
};

// Function to fetch transcript
const fetchTranscript = async (playbackId: string | undefined, sourceFile?: string): Promise<TranscriptSegment[]> => {
  if (!playbackId) {
    return [];
  }

  try {
    // Skip local transcript check as files have been removed

    // Otherwise try database or other fallback methods
    console.log("No local transcript available, checking database...");
    
    const { data: dbData, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("playback_id", playbackId)
      .single();

    if (error) {
      console.log("Error or no data in database:", error);
      return [];
    }

    if (dbData && dbData.segments) {
      // Type check and conversion - fix for the TypeScript error
      const segments = dbData.segments;
      
      // Make sure segments is an array
      if (Array.isArray(segments) && segments.length > 0) {
        console.log("Using transcript from database");
        // Ensure the data matches our TranscriptSegment type
        return segments.map((segment: any) => ({
          text: segment.text || "",
          startTime: Number(segment.startTime) || 0,
          endTime: Number(segment.endTime) || 0
        }));
      }
    }

    console.log("No transcript found anywhere");
    return [];
  } catch (error) {
    console.error("useTranscript error:", error);
    return [];
  }
};

// Hook to fetch transcript
export function useTranscript(playbackId: string | undefined, sourceFile?: string) {
  return useQuery({
    queryKey: ["transcript", playbackId, sourceFile],
    queryFn: () => fetchTranscript(playbackId, sourceFile),
    enabled: !!playbackId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Function to update transcript
export async function updateTranscript(
  playbackId: string,
  segments: TranscriptSegment[] | null,
  rawData: any = null,
  language: string = "pl"
) {
  try {
    const { data, error } = await supabase.functions.invoke("update-transcript", {
      body: { 
        playbackId, 
        segments, 
        rawData,
        language 
      },
    });

    if (error) {
      console.error("Error updating transcript:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("updateTranscript error:", error);
    throw error;
  }
}
