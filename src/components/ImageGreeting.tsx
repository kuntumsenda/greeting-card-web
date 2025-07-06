import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import domtoimage from 'dom-to-image';
import { DownloadOutlined } from '@ant-design/icons';

export interface ImageGreetingHandle {
  download: () => void;
}

interface ImageGreetingProps {
  imageUrl: string;
  dear: string;
  message: string;
  from: string;
  className?: string;
  style?: React.CSSProperties;
  hideDownloadButton?: boolean;
}

const ImageGreeting = forwardRef<ImageGreetingHandle, ImageGreetingProps>(
  ({ imageUrl, dear, message, from, className = '', style, hideDownloadButton = false }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
      if (!cardRef.current) return;
      try {
        const dataUrl = await domtoimage.toPng(cardRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `greeting-card.png`;
        link.click();
      } catch {
        alert('Failed to download image.');
      }
    };

    useImperativeHandle(ref, () => ({
      download: handleDownload,
    }));

    return (
      <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg ${className}`} style={style}>
        <div ref={cardRef} className="w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Greeting Card"
            className="w-full h-full object-cover"
          />
          <div className="absolute left-[50%] top-[50%] inset-0 flex flex-col max-w-[184px]" style={{transform: 'translate(-42%, -42%)'}}>
            <div  className='text-left'>
              <div className="rounded inline-block ml-[56px]">
                <span className="text-xs font-semibold text-black truncate block max-w-full" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '2.6' }}>{dear},</span>
              </div>
            </div>
            <div className="h-[63px]">
              <div className="brounded w-full">
                <p
                  className="text-black text-xs text-justify break-all whitespace-pre-line line-clamp-2 !mb-0"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '2.6' }}
                  title={message}
                >
                  {message}
                </p>
              </div>
            </div>
            <div className='text-left'>
              <div className="rounded inline-block ml-[44px]">
              <span className="text-xs font-semibold text-black truncate block max-w-full" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '2.6'}}>{from},</span>
              </div>
            </div>
          </div>
        </div>
        {!hideDownloadButton && (
          <button
            type="button"
            onClick={handleDownload}
            className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg z-20"
            aria-label="Download Greeting Card"
          >
            <DownloadOutlined />
          </button>
        )}
      </div>
    );
  }
);

ImageGreeting.displayName = "ImageGreeting";

export default ImageGreeting; 