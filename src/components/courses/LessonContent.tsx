
import { Lesson } from "@/types/course";
import { VideoPlayerWithTranscript } from "@/components/ui/video-player";
import { useState, useEffect } from "react";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Label
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface LessonContentProps {
  lesson: Lesson;
}

// Dane dla wykresu tokenów
const tokenComparisonData = [
  { name: "ChatGPT 3.5", tokens: 16000, fill: "#0066cc" },
  { name: "Gemini 1.0", tokens: 32000, fill: "#0066cc" },
  { name: "ChatGPT 4.0", tokens: 128000, fill: "#0066cc" },
];

const LessonContent = ({ lesson }: LessonContentProps) => {
  const [isMuxVideo, setIsMuxVideo] = useState(false);
  const [playbackId, setPlaybackId] = useState<string>("");
  
  // Set up the video source based on the videoUrl format
  useEffect(() => {
    if (lesson.videoUrl?.startsWith('mux:')) {
      setIsMuxVideo(true);
      setPlaybackId(lesson.videoUrl);
    } else {
      setIsMuxVideo(false);
    }
  }, [lesson.videoUrl]);

  // Helper function to format description text with proper line breaks and styling
  const formatDescription = (text: string) => {
    if (!text) return null;
    
    // Split by double line breaks to separate paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a numbered list item (starts with a number followed by a dot)
      if (/^\d+\.\s/.test(paragraph)) {
        return (
          <div key={index} className="mb-6">
            <h4 className="text-lg font-bold text-primary mb-2">{paragraph.split('\n')[0]}</h4>
            <div className="pl-4">
              {paragraph.split('\n').slice(1).map((p, i) => (
                <p key={i} className="mb-2 text-base leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        );
      }
      // Check if paragraph is a section heading (all caps or short without punctuation)
      else if (
        (paragraph.length < 100 && !paragraph.includes('.')) ||
        paragraph.toUpperCase() === paragraph
      ) {
        return (
          <h3 key={index} className="text-xl font-bold text-primary mt-8 mb-4">
            {paragraph}
          </h3>
        );
      }
      return <p key={index} className="mb-4 text-base leading-relaxed">{paragraph}</p>;
    });
  };

  // Komponent wykresu porównania tokenów
  const TokenComparisonChart = () => {
    return (
      <div className="mt-12 mb-10">
        <h3 className="text-xl font-bold text-primary mb-6 text-center">Możliwości przetwarzania tokenów</h3>
        <div className="w-full max-w-3xl mx-auto h-[350px] p-4 border border-white/20 rounded-xl bg-gradient-to-br from-purple/5 to-magenta/5 shadow-lg">
          <ChartContainer 
            config={{ 
              tokens: { color: "#0066cc" } 
            }}
            className="rounded-lg p-4 h-full"
          >
            <BarChart 
              data={tokenComparisonData} 
              margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'white' }} />
              <YAxis tick={{ fill: 'white' }}>
                <Label 
                  value="Ilość tokenów" 
                  position="insideLeft" 
                  angle={-90} 
                  style={{ textAnchor: 'middle', fill: 'white' }} 
                />
              </YAxis>
              <ChartTooltip
                content={
                  <ChartTooltipContent 
                    formatter={(value) => [`${value.toLocaleString()} tokenów`, 'Ilość']}
                  />
                }
              />
              <Bar dataKey="tokens" fill="#0066cc" />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl md:text-3xl font-bold">{lesson.displayTitle || lesson.title}</h1>
      
      {lesson.videoUrl && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-3">Wprowadzenie do Flowise</h2>
          <VideoPlayerWithTranscript
            src={lesson.videoUrl}
            poster={lesson.thumbnailUrl}
            title={lesson.title}
            transcript={lesson.transcript}
          />
        </div>
      )}
      
      {lesson.description && (
        <div className="prose prose-invert max-w-none mt-6">
          {formatDescription(lesson.description)}
        </div>
      )}

      {lesson.additionalVideos && lesson.additionalVideos.length > 0 && (
        <div className="space-y-8 mt-10">
          {lesson.additionalVideos.map((video, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold">
                {video.title || `Dodatkowe wideo ${index + 1}`}
              </h2>
              {video.videoUrl && (
                <VideoPlayerWithTranscript
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  title={video.title || `Dodatkowe wideo ${index + 1}`}
                  transcript={video.transcript}
                  transcriptSourceFile="2.json"
                />
              )}
              {video.description && (
                <div className="prose prose-invert max-w-none">
                  {formatDescription(video.description)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dodajemy wykres porównujący możliwości tokenów poniżej zawartości */}
      <TokenComparisonChart />
    </div>
  );
};

export default LessonContent;
