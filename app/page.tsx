import ChatInputBox from '@/components/ChatInputBox';
import { Button } from '@/components/ui/button';
import react from 'react';

export default function Page() {
  return (
    <div className='flex h-screen items-center justify-center w-full'>
      <ChatInputBox />
    </div>
  );
}
