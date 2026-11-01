import React from 'react';
import {Composition} from 'remotion';
import {BlueLED, TOTAL_FRAMES} from './BlueLED';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BlueLED"
    component={BlueLED}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
