import * as React from 'react';
import './HelpModal.pcss';
import Image from '../Image';

export const HelpModal = () => (
    <div className="HelpModal">
        <h3>What's the difference between a heap timeline and a heap snapshot?</h3>
        <p>A <strong>heap timeline</strong> is a record of all of the memory allocations in your web application over time - Chrome takes samples at 50ms intervals, allowing you to see how your memory is being allocated as you interact with your app.</p>
        <p>A <strong>heap snapshot</strong> on the other hand is a single representation of your app's memory when you take the snapshot. If a heap timeline is a movie, the heap snapshot is a single frame.</p>
        <h3>How do I create them?</h3>
        <ol>
            <li>To get started, open up the Chrome DevTools.</li>
            <Image src="/help-images/devtools.png" />
            <li>In the DevTools, click the Memory tab.</li>
            <Image src="/help-images/memory.png" />
            <li>Select either "Record Allocation Timeline" or "Take Heap Snapshot" and click "Start".</li>
            <Image src="/help-images/snapshot.png" />
            <li>For timelines, click the red dot to stop recording once you are done.</li>
            <Image src="/help-images/recording.png" />
            <li>Click "Save".</li>
            <Image src="/help-images/save.png" />
        </ol>
        <a href="https://developers.google.com/web/tools/chrome-devtools/memory-problems/">Read more about using Chrome memory tools to debug memory issues</a>
    </div>
);

export default HelpModal;
