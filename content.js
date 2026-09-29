/* Edit this file to add the final authors, links, prompts and media.
 * Paths are relative to index.html, e.g. "media/long/chunk-mix-01/ours.mp4".
 * Keep src empty until the file exists. Posters are optional.
 * Prompt start/end values are seconds and may be changed for actual switch times.
 */
window.SDF_CONTENT = {
  authors: [
    { name: 'Weiqiang Wang', url: '', affiliation: '1,*' },
    { name: 'Zhuokun Chen', url: '', affiliation: '1,*' },
    { name: 'Yusheng Dai', url: '', affiliation: '1' },
    { name: 'Boying Li', url: '', affiliation: '1' },
    { name: 'Yi Zhang', url: '', affiliation: '2,†' },
    { name: 'Hossein Rahmani', url: '', affiliation: '3' },
    { name: 'Qiuhong Ke', url: '', affiliation: '1,†' },
    { name: 'Jianfei Cai', url: '', affiliation: '1' }
  ],
  affiliations: [
    { id: '1', name: 'Monash University' },
    { id: '2', name: 'Vivix AI' },
    { id: '3', name: 'Lancaster University' }
  ],
  authorNotes: '* Equal contribution · † Corresponding authors',
  links: { Paper: '', Code: '', Models: '' },
  tldr: 'Self-Aligned Forcing trains all blocks in parallel with differentiable, stage-aligned noisy history, enabling faster training and multi-GPU pipelined inference for streaming video generation.',
  bibtex: '@article{selfalignedforcing,\n  title = {Self-Aligned Forcing: Streaming Video Diffusion with Differentiable Noisy History},\n  author = {Wang, Weiqiang and Chen, Zhuokun and Dai, Yusheng and Li, Boying and Zhang, Yi and Rahmani, Hossein and Ke, Qiuhong and Cai, Jianfei},\n  journal = {arXiv preprint},\n  year = {2026}\n}',
  long: [], interactive: []
};
const media = (label, ours = false) => ({ label, ours, fps: ours && label.includes('Single KV') ? 22.9 : ours && label.includes('Multiple KV') ? 49.1 : 'XXX', src: '', poster: '' });
const layouts = [
  ['chunk-mix-01', 'Chunk-wise', 'Single KV', 1], ['chunk-mix-02', 'Chunk-wise', 'Single KV', 2],
  ['chunk-matched-01', 'Chunk-wise', 'Multiple KV', 1], ['chunk-matched-02', 'Chunk-wise', 'Multiple KV', 2],
  ['frame-01', 'Frame-wise', 'Single KV + Multiple KV', 1], ['frame-02', 'Frame-wise', 'Single KV + Multiple KV', 2]
];
for (const section of ['long', 'interactive']) {
  for (const [id, family, mode, example] of layouts) {
    const duration = section === 'long' ? 100 : 60;
    SDF_CONTENT[section].push({ id: `${section}-${id}`, family, mode,
      title: `Example ${String(family === 'Chunk-wise' && mode === 'Multiple KV' ? example + 2 : example).padStart(2, '0')}`, duration,
      prompts: Array.from({ length: section === 'long' ? 1 : 6 }, (_, i) => ({
        start: section === 'long' ? 0 : i * 10, end: section === 'long' ? 100 : (i + 1) * 10,
        text: section === 'long' ? 'Prompt to be added.' : `Prompt ${i + 1} to be added.`
      })),
      videos: family === 'Chunk-wise'
        ? [media('SAF · Single KV', true), media('SAF · Multiple KV', true), media('HiAR'), media('LongLive'), media('SGF')]
        : [media('SAF · Single KV', true), media('SAF · Multiple KV', true), media('SGF'), media('Causal-Forcing')]
    });
  }
}
/* Add per-example assets here. Example:
SDF_CONTENT.long[0].videos[0].src = 'media/long/chunk-mix-01/ours.mp4';
SDF_CONTENT.long[0].prompts[0].text = 'Your actual generation prompt.';
SDF_CONTENT.interactive[0].prompts[0].text = 'Your first prompt.';
*/

// Imported MovieGen100 frame3 examples; five-column comparison layout with both Ours configurations.
// SAF-S = Single KV; SAF-M = Multiple KV. Duration is the common 99.75-second horizon.
SDF_CONTENT.long = [
  {
    "id": "long-movie-frame3-0308",
    "family": "Chunk-wise",
    "title": "Example 01",
    "duration": 99.75,
    "prompts": [
      {
        "start": 0,
        "end": 99.75,
        "text": "A detailed realist photograph captures a middle-aged man methodically wiping down a kitchen counter with a clean, white cloth. His focused expression conveys determination as he ensures every surface is spotlessly clean. He stands upright, leaning slightly forward, with one hand gripping the edge of the counter and the other holding the cloth. The background features modern kitchen appliances and cabinets, with subtle reflections in the glass surfaces. Shadows cast by the overhead lights add depth to the scene. The photo has a crisp, clear texture. A medium shot from a slightly elevated angle, highlighting the man's dedication and the pristine cleanliness of the kitchen."
      }
    ],
    "videos": [
      {
        "label": "SAF · Single KV",
        "ours": true,
        "fps": 22.9,
        "src": "media/long/movie_frame3/SAF-S/0308.mp4",
        "poster": "media/long/movie_frame3/SAF-S/0308.jpg"
      },
      {
        "label": "SAF · Multiple KV",
        "ours": true,
        "fps": 49.1,
        "src": "media/long/movie_frame3/SAF-M/0308.mp4",
        "poster": "media/long/movie_frame3/SAF-M/0308.jpg"
      },
      {
        "label": "HiAR",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/HiAR/0308.mp4",
        "poster": "media/long/movie_frame3/HiAR/0308.jpg"
      },
      {
        "label": "LongLive",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/LongLive/0308.mp4",
        "poster": "media/long/movie_frame3/LongLive/0308.jpg"
      },
      {
        "label": "SGF",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/SGF/0308.mp4",
        "poster": "media/long/movie_frame3/SGF/0308.jpg"
      }
    ]
  },
  {
    "id": "long-movie-frame3-0483",
    "family": "Chunk-wise",
    "title": "Example 02",
    "duration": 99.75,
    "prompts": [
      {
        "start": 0,
        "end": 99.75,
        "text": "A vintage-style photograph of a young woman in a flowing floral dress dropping a coin into a wishing well. She has wavy brown hair tied back with a ribbon, and her eyes sparkle with hope and determination as she gazes into the well. Her posture is upright, and her hand gently holds the coin before letting it drop. The background is a blurred scene of a quaint town square with old buildings and a few people walking by. The well itself is ornately carved with intricate designs, and the water ripples softly. The photo has a soft, nostalgic texture. A close-up shot from a slightly elevated angle."
      }
    ],
    "videos": [
      {
        "label": "SAF · Single KV",
        "ours": true,
        "fps": 22.9,
        "src": "media/long/movie_frame3/SAF-S/0483.mp4",
        "poster": "media/long/movie_frame3/SAF-S/0483.jpg"
      },
      {
        "label": "SAF · Multiple KV",
        "ours": true,
        "fps": 49.1,
        "src": "media/long/movie_frame3/SAF-M/0483.mp4",
        "poster": "media/long/movie_frame3/SAF-M/0483.jpg"
      },
      {
        "label": "HiAR",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/HiAR/0483.mp4",
        "poster": "media/long/movie_frame3/HiAR/0483.jpg"
      },
      {
        "label": "LongLive",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/LongLive/0483.mp4",
        "poster": "media/long/movie_frame3/LongLive/0483.jpg"
      },
      {
        "label": "SGF",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/SGF/0483.mp4",
        "poster": "media/long/movie_frame3/SGF/0483.jpg"
      }
    ]
  },
  {
    "id": "long-movie-frame3-0803",
    "family": "Chunk-wise",
    "title": "Example 03",
    "duration": 99.75,
    "prompts": [
      {
        "start": 0,
        "end": 99.75,
        "text": "A realistic photo-style image of a large truck parked right alongside a flowing river, capturing the dynamic movement of the water and the lush, verdant forest surrounding it. The truck is positioned slightly off-center, with its wheels touching the riverbank. The water flows swiftly, creating ripples and splashes that reflect the sunlight. The forest behind the truck is dense and green, with tall trees and underbrush casting shadows. The photo has a natural and lifelike texture, with subtle blurring of the background to highlight the movement of the water. A mid-shot from a slightly elevated angle, capturing both the truck and the river."
      }
    ],
    "videos": [
      {
        "label": "SAF · Single KV",
        "ours": true,
        "fps": 22.9,
        "src": "media/long/movie_frame3/SAF-S/0803.mp4",
        "poster": "media/long/movie_frame3/SAF-S/0803.jpg"
      },
      {
        "label": "SAF · Multiple KV",
        "ours": true,
        "fps": 49.1,
        "src": "media/long/movie_frame3/SAF-M/0803.mp4",
        "poster": "media/long/movie_frame3/SAF-M/0803.jpg"
      },
      {
        "label": "HiAR",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/HiAR/0803.mp4",
        "poster": "media/long/movie_frame3/HiAR/0803.jpg"
      },
      {
        "label": "LongLive",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/LongLive/0803.mp4",
        "poster": "media/long/movie_frame3/LongLive/0803.jpg"
      },
      {
        "label": "SGF",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/SGF/0803.mp4",
        "poster": "media/long/movie_frame3/SGF/0803.jpg"
      }
    ]
  },
  {
    "id": "long-movie-frame3-0818",
    "family": "Chunk-wise",
    "title": "Example 04",
    "duration": 99.75,
    "prompts": [
      {
        "start": 0,
        "end": 99.75,
        "text": "A dramatic tilt-down shot from the ceiling of a grand Gothic cathedral, revealing the intricate golden mosaics depicting biblical scenes and saints, with each tile meticulously arranged to form detailed patterns. The central focus is on the ornate altar below, adorned with candles and religious artifacts, creating a sacred and awe-inspiring atmosphere. The background features the soaring arches and stained glass windows, allowing a shaft of light to filter through, casting colorful hues across the mosaic floor. The scene has a detailed and realistic style, capturing the grandeur and solemnity of the cathedral interior."
      }
    ],
    "videos": [
      {
        "label": "SAF · Single KV",
        "ours": true,
        "fps": 22.9,
        "src": "media/long/movie_frame3/SAF-S/0818.mp4",
        "poster": "media/long/movie_frame3/SAF-S/0818.jpg"
      },
      {
        "label": "SAF · Multiple KV",
        "ours": true,
        "fps": 49.1,
        "src": "media/long/movie_frame3/SAF-M/0818.mp4",
        "poster": "media/long/movie_frame3/SAF-M/0818.jpg"
      },
      {
        "label": "HiAR",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/HiAR/0818.mp4",
        "poster": "media/long/movie_frame3/HiAR/0818.jpg"
      },
      {
        "label": "LongLive",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/LongLive/0818.mp4",
        "poster": "media/long/movie_frame3/LongLive/0818.jpg"
      },
      {
        "label": "SGF",
        "ours": false,
        "fps": "XXX",
        "src": "media/long/movie_frame3/SGF/0818.mp4",
        "poster": "media/long/movie_frame3/SGF/0818.jpg"
      }
    ]
  }
].concat(SDF_CONTENT.long.filter(group => group.family === 'Frame-wise'));

// Interactive: two chunk-wise examples, with frame-wise examples preserved.
SDF_CONTENT.interactive = [
  ...SDF_CONTENT.interactive.filter(group => group.family === 'Chunk-wise').slice(0, 2),
  ...SDF_CONTENT.interactive.filter(group => group.family === 'Frame-wise')
];

// User-provided generation throughput; values are not video encoding frame rates.
for (const section of ['long', 'interactive']) {
  for (const group of SDF_CONTENT[section]) {
    for (const video of group.videos) {
      const framewise = group.family === 'Frame-wise';
      if (video.ours) {
        const single = video.label.includes('Single KV');
        video.fps = framewise ? (single ? 9.07 : '9.08 / 21.6') : (single ? 22.9 : '22.8 / 49.1');
        if (!single) video.fpsNote = '1 GPU / 4 GPUs';
      } else if (framewise && ['SGF', 'Causal-Forcing'].includes(video.label)) {
        video.fps = 8.9;
      } else if (!framewise && ['LongLive', 'SGF'].includes(video.label)) {
        video.fps = 20.7;
      } else if (!framewise && video.label === 'HiAR') {
        video.fps = '11.2 / 30.0';
        video.fpsNote = '1 GPU / 4 GPUs';
      }
    }
  }
}

// Action-only sequence, zero-based prompt ID 1 (boy), for Interactive Example 02.
SDF_CONTENT.interactive[1] = {
  "id": "interactive-actiononly-id-0001",
  "family": "Chunk-wise",
  "title": "Example 02",
  "duration": 59.8125,
  "prompts": [
    {
      "start": 0,
      "end": 10.3125,
      "text": "A young boy with short dark hair stands in the center of a green lawn, smiling with his arms relaxed. He wears a plain blue T-shirt, beige shorts, and white sneakers. A softly blurred hedge and pale blue sky form the quiet background. Gentle morning sunlight clearly lights his face and clothes. A steady full-body shot keeps his head and shoes visible, with generous room above his head and beside his arms. The lawn immediately around him is clear so his movements can stay near the center of the frame.",
      "emphasis": [
        "stands in the center of a green lawn, smiling with his arms relaxed."
      ],
      "underline": []
    },
    {
      "start": 10.3125,
      "end": 20.0625,
      "text": "The boy begins jogging lightly in place, swinging his arms in a relaxed rhythm.",
      "emphasis": [
        "The boy begins jogging lightly in place, swinging his arms in a relaxed rhythm."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 20.0625,
      "end": 29.8125,
      "text": "The boy jogs faster in place, lifting his knees higher and leaning forward slightly while smiling.",
      "emphasis": [
        "The boy jogs faster in place, lifting his knees higher and leaning forward slightly while smiling."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 29.8125,
      "end": 40.3125,
      "text": "The boy bends his knees and makes one playful upward hop with both arms raised, remaining centered in the frame.",
      "emphasis": [
        "The boy bends his knees and makes one playful upward hop with both arms raised"
      ],
      "underline": []
    },
    {
      "start": 40.3125,
      "end": 50.0625,
      "text": "The boy lands on the grass with bent knees, then resumes a relaxed jog in place.",
      "emphasis": [
        "The boy lands on the grass with bent knees, then resumes a relaxed jog in place."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 50.0625,
      "end": 59.8125,
      "text": "The boy stops jogging and places both hands on his hips. He leans forward slightly as he catches his breath, still smiling.",
      "emphasis": [
        "The boy stops jogging and places both hands on his hips."
      ],
      "underline": []
    }
  ],
  "videos": [
    {
      "label": "SAF · Single KV",
      "ours": true,
      "fps": 22.9,
      "fpsNote": "",
      "src": "media/interactive/longlive_actiononly6_v1/id-0001/SAF-S.mp4",
      "poster": "media/interactive/longlive_actiononly6_v1/id-0001/SAF-S.jpg"
    },
    {
      "label": "SAF · Multiple KV",
      "ours": true,
      "fps": "22.8 / 49.1",
      "fpsNote": "1 GPU / 4 GPUs",
      "src": "media/interactive/longlive_actiononly6_v1/id-0001/SAF-M.mp4",
      "poster": "media/interactive/longlive_actiononly6_v1/id-0001/SAF-M.jpg"
    },
    {
      "label": "LongLive",
      "ours": false,
      "fps": 20.7,
      "fpsNote": "",
      "src": "media/interactive/longlive_actiononly6_v1/id-0001/LongLive.mp4",
      "poster": "media/interactive/longlive_actiononly6_v1/id-0001/LongLive.jpg"
    },
    {
      "label": "SGF",
      "ours": false,
      "fps": 20.7,
      "fpsNote": "",
      "src": "media/interactive/longlive_actiononly6_v1/id-0001/SGF.mp4",
      "poster": "media/interactive/longlive_actiononly6_v1/id-0001/SGF.jpg"
    }
  ]
};

// Reader sequence: source prompt index 1, seed 100. Original prompts preserved.
SDF_CONTENT.interactive[0] = {
  "id": "interactive-reader-seed100-id0001",
  "family": "Chunk-wise",
  "title": "Example 01",
  "duration": 59.8125,
  "prompts": [
    {
      "start": 0,
      "end": 10.3125,
      "text": "A woman with shoulder-length dark hair wears a soft green sweater and beige trousers, seated upright in a cream armchair beside a large window on the left side of the image. A single broad blue hardcover book lies open across her thighs, well below her chest; both hands rest visibly on the outer edges of its pages. She looks down at the open book on her thighs and reads quietly, with each hand resting on one outer page edge. She keeps the book still without turning pages. Her face is unobstructed. Gentle afternoon window light illuminates her face and the book in a quiet room. A locked three-quarter seated shot includes her entire head, both forearms, hands, lap, book, and the nearby window edge.",
      "emphasis": [
        "She looks down at the open book on her thighs and reads quietly"
      ]
    },
    {
      "start": 10.3125,
      "end": 20.0625,
      "text": "Keeping the book open and both hands resting on its edges, she slowly lifts her head and turns her gaze toward the window at image left. Her shoulders remain facing forward.",
      "emphasis": [
        "she slowly lifts her head and turns her gaze toward the window at image left."
      ]
    },
    {
      "start": 20.0625,
      "end": 29.8125,
      "text": "She continues looking toward the window and gives a gentle smile. The book remains open on her thighs, held still by both hands.",
      "emphasis": [
        "She continues looking toward the window and gives a gentle smile."
      ]
    },
    {
      "start": 29.8125,
      "end": 40.3125,
      "text": "She turns her face back toward the book, lowers her gaze, and resumes reading. Both hands remain on the outer edges of the open book.",
      "emphasis": [
        "She turns her face back toward the book, lowers her gaze, and resumes reading."
      ]
    },
    {
      "start": 40.3125,
      "end": 50.0625,
      "text": "She finishes reading. Her left hand steadies the lower half of the book on her lap while her right hand brings the opposite cover over in one slow closing motion. The book ends fully closed, blue cover facing upward.",
      "emphasis": [
        "Her left hand steadies the lower half of the book on her lap while her right hand brings the opposite cover over in one slow closing motion"
      ]
    },
    {
      "start": 50.0625,
      "end": 59.8125,
      "text": "With the blue book closed and lying flat on her thighs, she rests both hands on its cover, then lifts her head and looks forward with a relaxed smile.",
      "emphasis": [
        "she rests both hands on its cover, then lifts her head and looks forward with a relaxed smile."
      ]
    }
  ],
  "videos": [
    {
      "label": "SAF · Single KV",
      "ours": true,
      "fps": 22.9,
      "fpsNote": "",
      "src": "media/interactive/singer_reader2/seed100/id-0001/SAF-S.mp4",
      "poster": "media/interactive/singer_reader2/seed100/id-0001/SAF-S.jpg"
    },
    {
      "label": "SAF · Multiple KV",
      "ours": true,
      "fps": "22.8 / 49.1",
      "fpsNote": "1 GPU / 4 GPUs",
      "src": "media/interactive/singer_reader2/seed100/id-0001/SAF-M.mp4",
      "poster": "media/interactive/singer_reader2/seed100/id-0001/SAF-M.jpg"
    },
    {
      "label": "HiAR",
      "ours": false,
      "fps": "11.2 / 30.0",
      "fpsNote": "1 GPU / 4 GPUs",
      "src": "media/interactive/singer_reader2/seed100/id-0001/HiAR.mp4",
      "poster": "media/interactive/singer_reader2/seed100/id-0001/HiAR.jpg"
    },
    {
      "label": "LongLive",
      "ours": false,
      "fps": 20.7,
      "fpsNote": "",
      "src": "media/interactive/singer_reader2/seed100/id-0001/LongLive.mp4",
      "poster": "media/interactive/singer_reader2/seed100/id-0001/LongLive.jpg"
    },
    {
      "label": "SGF",
      "ours": false,
      "fps": 20.7,
      "fpsNote": "",
      "src": "media/interactive/singer_reader2/seed100/id-0001/SGF.mp4",
      "poster": "media/interactive/singer_reader2/seed100/id-0001/SGF.jpg"
    }
  ]
};

// Frame-wise Example 02: boy, source ID 0, seed 100.
SDF_CONTENT.interactive[3] = {
  "id": "interactive-frame1-boy-seed100-id0000",
  "family": "Frame-wise",
  "title": "Example 02",
  "duration": 59.8125,
  "prompts": [
    {
      "start": 0,
      "end": 9.8125,
      "text": "A young boy with short dark hair stands in the center of a green lawn, smiling with his arms relaxed. He wears a plain blue T-shirt, beige shorts, and white sneakers. A softly blurred hedge and pale blue sky form the quiet background. Gentle morning sunlight clearly lights his face and clothes. A steady full-body shot keeps his head and shoes visible, with generous room above his head and beside his arms. The lawn immediately around him is clear so his movements can stay near the center of the frame.",
      "emphasis": [
        "stands in the center of a green lawn, smiling with his arms relaxed."
      ],
      "underline": []
    },
    {
      "start": 9.8125,
      "end": 19.8125,
      "text": "The boy begins jogging lightly in place, swinging his arms in a relaxed rhythm.",
      "emphasis": [
        "The boy begins jogging lightly in place, swinging his arms in a relaxed rhythm."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 19.8125,
      "end": 29.8125,
      "text": "The boy jogs faster in place, lifting his knees higher and leaning forward slightly while smiling.",
      "emphasis": [
        "The boy jogs faster in place, lifting his knees higher and leaning forward slightly while smiling."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 29.8125,
      "end": 39.8125,
      "text": "The boy bends his knees and makes one playful upward hop with both arms raised, remaining centered in the frame.",
      "emphasis": [
        "The boy bends his knees and makes one playful upward hop with both arms raised"
      ],
      "underline": []
    },
    {
      "start": 39.8125,
      "end": 49.8125,
      "text": "The boy lands on the grass with bent knees, then resumes a relaxed jog in place.",
      "emphasis": [
        "The boy lands on the grass with bent knees, then resumes a relaxed jog in place."
      ],
      "underline": [
        "in place"
      ]
    },
    {
      "start": 49.8125,
      "end": 59.8125,
      "text": "The boy stops jogging and places both hands on his hips. He leans forward slightly as he catches his breath, still smiling.",
      "emphasis": [
        "The boy stops jogging and places both hands on his hips."
      ],
      "underline": []
    }
  ],
  "videos": [
    {
      "label": "SAF · Single KV",
      "ours": true,
      "fps": 9.07,
      "fpsNote": "",
      "src": "media/interactive/frame1_self/seed100/id-0000/SAF-S.mp4",
      "poster": "media/interactive/frame1_self/seed100/id-0000/SAF-S.jpg"
    },
    {
      "label": "SAF · Multiple KV",
      "ours": true,
      "fps": "9.08 / 21.6",
      "fpsNote": "1 GPU / 4 GPUs",
      "src": "media/interactive/frame1_self/seed100/id-0000/SAF-M.mp4",
      "poster": "media/interactive/frame1_self/seed100/id-0000/SAF-M.jpg"
    },
    {
      "label": "SGF",
      "ours": false,
      "fps": 8.9,
      "fpsNote": "",
      "src": "media/interactive/frame1_self/seed100/id-0000/SGF.mp4",
      "poster": "media/interactive/frame1_self/seed100/id-0000/SGF.jpg"
    },
    {
      "label": "Causal-Forcing",
      "ours": false,
      "fps": 8.9,
      "fpsNote": "",
      "src": "media/interactive/frame1_self/seed100/id-0000/Causal-Forcing.mp4",
      "poster": "media/interactive/frame1_self/seed100/id-0000/Causal-Forcing.jpg"
    }
  ]
};

// Apply the same column order to all long-video and interactive examples.
for (const section of ['long', 'interactive']) {
  for (const group of SDF_CONTENT[section]) {
    const target = group.family === 'Chunk-wise' ? 'SAF · Multiple KV' : 'Causal-Forcing';
    const index = group.videos.findIndex(video => video.label === target);
    if (index < 0) continue;
    const [video] = group.videos.splice(index, 1);
    group.videos.splice(group.family === 'Chunk-wise' ? 3 : 1, 0, video);
  }
}

// Frame-wise reader: same edited wording and motion emphasis as chunk-wise reader.
{
  const reader = SDF_CONTENT.interactive.find(group => group.id === 'interactive-reader-seed100-id0001');
  const framewise = SDF_CONTENT.interactive.filter(group => group.family === 'Frame-wise')[0];
  const boundaries = [0, 9.8125, 19.8125, 29.8125, 39.8125, 49.8125, 59.8125];
  framewise.id = 'interactive-frame1-reading';
  framewise.duration = 59.8125;
  framewise.prompts = reader.prompts.map((prompt, i) => ({
    ...prompt, emphasis: [...(prompt.emphasis || [])],
    start: boundaries[i], end: boundaries[i + 1]
  }));
  framewise.videos = [
  {
    "label": "SAF · Single KV",
    "ours": true,
    "fps": 9.07,
    "fpsNote": "",
    "src": "media/interactive/frame1_self/reading/SAF-S.mp4",
    "poster": "media/interactive/frame1_self/reading/SAF-S.jpg"
  },
  {
    "label": "Causal-Forcing",
    "ours": false,
    "fps": 8.9,
    "fpsNote": "",
    "src": "media/interactive/frame1_self/reading/Causal-Forcing.mp4",
    "poster": "media/interactive/frame1_self/reading/Causal-Forcing.jpg"
  },
  {
    "label": "SAF · Multiple KV",
    "ours": true,
    "fps": "9.08 / 21.6",
    "fpsNote": "1 GPU / 4 GPUs",
    "src": "media/interactive/frame1_self/reading/SAF-M.mp4",
    "poster": "media/interactive/frame1_self/reading/SAF-M.jpg"
  },
  {
    "label": "SGF",
    "ours": false,
    "fps": 8.9,
    "fpsNote": "",
    "src": "media/interactive/frame1_self/reading/SGF.mp4",
    "poster": "media/interactive/frame1_self/reading/SGF.jpg"
  }
];
}

// Movie 100, frame-wise UniTemp original prompt ID 896.
{
  const group = SDF_CONTENT.long.filter(group => group.family === 'Frame-wise')[0];
  group.id = 'long-movie-frame1-0896';
  group.duration = 100.3125;
  group.prompts = [{"start": 0, "end": 100.3125, "text": "A vibrant and lively scene from a colorful Indian festival in Mumbai, where a toy robot wearing blue jeans and a white T-shirt takes a pleasant stroll. The robot has a friendly expression, with its arms swinging naturally as it walks along the bustling streets. The background is filled with people in traditional attire, vibrant decorations, and colorful lights, creating a festive atmosphere. The festival is alive with music and dance, and there are stalls selling various sweets and snacks. The robot appears to be enjoying the festivities, with its legs moving in a casual, relaxed manner. The camera angle is slightly elevated, capturing both the robot and the vibrant surroundings."}];
  const assets = {
  "SAF · Single KV": {
    "src": "media/long/movie_frame1/0896/SAF-S.mp4?v=corrected-labels",
    "poster": "media/long/movie_frame1/0896/SAF-S.jpg?v=corrected-labels"
  },
  "Causal-Forcing": {
    "src": "media/long/movie_frame1/0896/Causal-Forcing.mp4",
    "poster": "media/long/movie_frame1/0896/Causal-Forcing.jpg"
  },
  "SAF · Multiple KV": {
    "src": "media/long/movie_frame1/0896/SAF-M.mp4?v=corrected-labels",
    "poster": "media/long/movie_frame1/0896/SAF-M.jpg?v=corrected-labels"
  },
  "SGF": {
    "src": "media/long/movie_frame1/0896/SGF.mp4",
    "poster": "media/long/movie_frame1/0896/SGF.jpg"
  }
};
  group.videos.forEach(video => Object.assign(video, assets[video.label]));
}

// Movie 100, frame-wise UniTemp original prompt ID 455.
{
  const group = SDF_CONTENT.long.filter(group => group.family === 'Frame-wise')[1];
  group.id = 'long-movie-frame1-0455';
  group.duration = 100.3125;
  group.prompts = [{"start": 0, "end": 100.3125, "text": "A high-speed video capturing the moment champagne is poured into a glass, with bubbles rising rapidly and cascading down the sides. The glass is clear and elegant, reflecting the sparkling liquid inside. The bubbles form and pop with each other, creating a lively and dynamic scene. The background is a blurred, dimly lit room, emphasizing the focus on the champagne. The camera angle is from below, providing a dramatic perspective of the pouring action."}];
  const assets = {
  "SAF · Single KV": {
    "src": "media/long/movie_frame1/0455/SAF-S.mp4",
    "poster": "media/long/movie_frame1/0455/SAF-S.jpg"
  },
  "Causal-Forcing": {
    "src": "media/long/movie_frame1/0455/Causal-Forcing.mp4",
    "poster": "media/long/movie_frame1/0455/Causal-Forcing.jpg"
  },
  "SAF · Multiple KV": {
    "src": "media/long/movie_frame1/0455/SAF-M.mp4",
    "poster": "media/long/movie_frame1/0455/SAF-M.jpg"
  },
  "SGF": {
    "src": "media/long/movie_frame1/0455/SGF.mp4",
    "poster": "media/long/movie_frame1/0455/SGF.jpg"
  }
};
  group.videos.forEach(video => Object.assign(video, assets[video.label]));
}

// Selected HiAR boy candidate 04: complete the five-method Interactive comparison.
{
  const group = SDF_CONTENT.interactive.find(group => group.id === 'interactive-actiononly-id-0001');
  const methods = Object.fromEntries(group.videos.map(video => [video.label, video]));
  methods.HiAR = {
    label: 'HiAR', ours: false, fps: '11.2 / 30.0', fpsNote: '1 GPU / 4 GPUs',
    src: 'media/interactive/longlive_actiononly6_v1/id-0001/HiAR.mp4',
    poster: 'media/interactive/longlive_actiononly6_v1/id-0001/HiAR.jpg'
  };
  group.videos = ['SAF · Single KV', 'HiAR', 'LongLive', 'SAF · Multiple KV', 'SGF']
    .map(label => methods[label]);
}

// Present Movie 100 frame-wise prompt 455 before prompt 896.
{
  const first = SDF_CONTENT.long.findIndex(group => group.id === 'long-movie-frame1-0896');
  const second = SDF_CONTENT.long.findIndex(group => group.id === 'long-movie-frame1-0455');
  if (first < 0 || second < 0) throw new Error('Missing Movie 100 frame-wise examples');
  [SDF_CONTENT.long[first], SDF_CONTENT.long[second]] =
    [SDF_CONTENT.long[second], SDF_CONTENT.long[first]];
  SDF_CONTENT.long[first].title = 'Example 01';
  SDF_CONTENT.long[second].title = 'Example 02';
}
