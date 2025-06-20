
import React, { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

interface VideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoDialog = ({ open, onOpenChange }: VideoDialogProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const VIDEO_URL = "https://jwuenhictjprfbktfzjy.supabase.co/storage/v1/object/public/demovideo/aipromptmachinedemo.MOV";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log('Video started playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      console.log('Video ended');
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      console.log('Video can start playing');
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      const videoElement = e.target as HTMLVideoElement;
      if (videoElement.error) {
        console.error('Video error details:', {
          code: videoElement.error.code,
          message: videoElement.error.message
        });
        
        let errorMsg = 'Failed to load video';
        switch (videoElement.error.code) {
          case 1:
            errorMsg = 'Video loading was aborted';
            break;
          case 2:
            errorMsg = 'Network error while loading video';
            break;
          case 3:
            errorMsg = 'Video format not supported';
            break;
          case 4:
            errorMsg = 'Video file not found or accessible';
            break;
        }
        setErrorMessage(errorMsg);
      }
      setIsLoading(false);
      setHasError(true);
    };

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (open && videoRef.current) {
      console.log('Dialog opened, resetting video');
      // Reset video when dialog opens
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
    }
  }, [open]);

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
          setHasError(true);
          setErrorMessage('Failed to play video');
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    // Hide controls after 3 seconds of no mouse movement
    setTimeout(() => setShowControls(false), 3000);
  };

  const retryVideo = () => {
    if (videoRef.current) {
      console.log('Retrying video load');
      setHasError(false);
      setErrorMessage('');
      setIsLoading(true);
      videoRef.current.load();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] bg-slate-900 border border-white/20 text-white p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-white">
            AiPromptMachine Demo
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            See how AiPromptMachine transforms your ideas into professional video prompts
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="relative group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[60vh] bg-black rounded-b-lg"
            poster="/placeholder.svg"
            preload="metadata"
            muted={isMuted}
            playsInline
            crossOrigin="anonymous"
          >
            <source src={VIDEO_URL} type="video/quicktime" />
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Loading State */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <p className="mb-2 font-semibold">Video Error</p>
                <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
                <Button
                  onClick={retryVideo}
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {/* Video Controls Overlay */}
          {!isLoading && !hasError && (
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              {/* Play/Pause Button - Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={togglePlay}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
              
              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 pt-2">
          <div className="flex justify-center">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Close Demo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
