// Mock / Fake data for Alcheringa Modules & Competitions
// Used when backend is unavailable or during development

const DEFAULT_IMAGE = '/assets/competetion_img.png';

export const MOCK_MODULES_DATA = {
  drama: {
    name: 'Drama',
    competitions: [
      { id: 'drama-1', event_name: 'Theatrix', competetion: 'Theatrix', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Theatre that hits harder than a punchline. Stage your best act, from monologue to full ensemble.', prize_worth: '[TBD]' },
      { id: 'drama-2', event_name: 'Halla Bol', competetion: 'Halla Bol', image: DEFAULT_IMAGE, module: 'Drama', desc: 'High-energy street play (Nukkad Natak) with pulsating rhythm and social awareness.', prize_worth: '[TBD]' },
      { id: 'drama-3', event_name: 'Monodrama', competetion: 'Monodrama', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Solo acting competition demanding emotional depth, versatility, and commanding presence.', prize_worth: '[TBD]' },
      { id: 'drama-4', event_name: 'Stage Craft', competetion: 'Stage Craft', image: DEFAULT_IMAGE, module: 'Drama', desc: 'One-act drama showdown between premier collegiate theatre societies.', prize_worth: '[TBD]' },
      { id: 'drama-5', event_name: 'Nukkad Natak', competetion: 'Nukkad Natak', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Captivating open-air street performance addressing powerful social themes.', prize_worth: '[TBD]' },
      { id: 'drama-6', event_name: 'Mime Act', competetion: 'Mime Act', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Silent storytelling through expressions, gestures, and body movement.', prize_worth: '[TBD]' },
      { id: 'drama-7', event_name: 'Script-o-Mania', competetion: 'Script-o-Mania', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Original playwriting and script crafting competition.', prize_worth: '[TBD]' },
      { id: 'drama-8', event_name: 'Curtain Call', competetion: 'Curtain Call', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Impromptu improvisational acting and spot scene challenges.', prize_worth: '[TBD]' },
      { id: 'drama-9', event_name: 'Dramatics Clash', competetion: 'Dramatics Clash', image: DEFAULT_IMAGE, module: 'Drama', desc: 'Inter-college theatrical drama showcase of sheer talent.', prize_worth: '[TBD]' }
    ]
  },
  dance: {
    name: 'Dance',
    competitions: [
      { id: 'dance-1', event_name: 'Electric Heels', competetion: 'Electric Heels', image: DEFAULT_IMAGE, module: 'Dance', desc: 'Western solo dance showdown showcasing rhythm, technique, and energy.', prize_worth: '[TBD]' },
      { id: 'dance-2', event_name: 'Step Up', competetion: 'Step Up', image: DEFAULT_IMAGE, module: 'Dance', desc: 'Anybody can dance, but can you own the floor? Solo and crew rounds, all styles welcome.', prize_worth: '[TBD]' },
      { id: 'dance-3', event_name: 'Navras', competetion: 'Navras', image: DEFAULT_IMAGE, module: 'Dance', desc: 'Classical solo dance capturing the nine timeless human emotions.', prize_worth: '[TBD]' },
      { id: 'dance-4', event_name: 'SUTUCD', competetion: 'SUTUCD', image: DEFAULT_IMAGE, module: 'Dance', desc: 'So You Think You Can Dance: Premier group choreography competition.', prize_worth: '[TBD]' },
      { id: 'dance-5', event_name: 'Dancing Duo', competetion: 'Dancing Duo', image: DEFAULT_IMAGE, module: 'Dance', desc: 'Two dancers, one synchronized rhythm in an electrifying duet showcase.', prize_worth: '[TBD]' },
      { id: 'dance-6', event_name: 'Street Dance', competetion: 'Street Dance', image: DEFAULT_IMAGE, module: 'Dance', desc: 'Raw cyphers and all-styles street dance battles.', prize_worth: '[TBD]' }
    ]
  },
  music: {
    name: 'Music',
    competitions: [
      { id: 'music-1', event_name: 'Voice of Alcheringa', competetion: 'Voice of Alcheringa', image: DEFAULT_IMAGE, module: 'Music', desc: 'Flagship solo singing championship seeking the golden voice of India.', prize_worth: '[TBD]' },
      { id: 'music-2', event_name: 'Unplugged', competetion: 'Unplugged', image: DEFAULT_IMAGE, module: 'Music', desc: 'Acoustic and semi-acoustic band competition with soulful melodies.', prize_worth: '[TBD]' },
      { id: 'music-3', event_name: 'Rock-o-phonix', competetion: 'Rock-o-phonix', image: DEFAULT_IMAGE, module: 'Music', desc: 'The biggest rock and metal band battle in Eastern India.', prize_worth: '[TBD]' },
      { id: 'music-4', event_name: 'BeatBash', competetion: 'BeatBash', image: DEFAULT_IMAGE, module: 'Music', desc: 'Microphone mastery, beatboxing, and vocal percussion showdown.', prize_worth: '[TBD]' },
      { id: 'music-5', event_name: 'Crossfade', competetion: 'Crossfade', image: DEFAULT_IMAGE, module: 'Music', desc: 'DJing and electronic music production face-off on the turntables.', prize_worth: '[TBD]' },
      { id: 'music-6', event_name: 'Acoustic Solo', competetion: 'Acoustic Solo', image: DEFAULT_IMAGE, module: 'Music', desc: 'Stripped-down instrumental and vocal acoustic mastery.', prize_worth: '[TBD]' }
    ]
  },
  classapart: {
    name: 'Class Apart',
    competitions: [
      { id: 'ca-1', event_name: 'Stagecraft', competetion: 'Stagecraft', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Theatre that hits harder than a punchline. Stage your best act, from monologue to full ensemble.', prize_worth: '[TBD]' },
      { id: 'ca-2', event_name: 'ABCD', competetion: 'ABCD', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Anybody can dance, but can you own the floor? Solo and crew rounds, all styles welcome.', prize_worth: '[TBD]' },
      { id: 'ca-3', event_name: 'Class Apart', competetion: 'Class Apart', image: DEFAULT_IMAGE, module: 'Class Apart', desc: "Talent that doesn't fit in a box. Beatbox, stand-up, magic, whatever makes you you.", prize_worth: '[TBD]' },
      { id: 'ca-4', event_name: 'Music', competetion: 'Music', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'From acoustic harmonies to thunderous rock riffs, bring your melody to life on the grand stage.', prize_worth: '[TBD]' },
      { id: 'ca-5', event_name: 'Vouge Nation', competetion: 'Vouge Nation', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'High fashion meets fierce attitude. Strut the runway with sheer elegance and bespoke style.', prize_worth: '[TBD]' },
      { id: 'ca-6', event_name: 'Art Talkies', competetion: 'Art Talkies', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Unleash your creativity on canvas, clay, and walls with strokes of pure imagination.', prize_worth: '[TBD]' },
      { id: 'ca-7', event_name: 'Rock-o-phonix', competetion: 'Rock-o-phonix', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'The biggest rock and metal band battle in Eastern India.', prize_worth: '[TBD]' },
      { id: 'ca-8', event_name: 'Rap Battle', competetion: 'Rap Battle', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Spit bars, rhymes, and rhythms in an electrifying freestyle rap faceoff.', prize_worth: '[TBD]' },
      { id: 'ca-9', event_name: 'Mr & Ms Alcheringa', competetion: 'Mr & Ms Alcheringa', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Personality, charisma, and talent: crown the next faces of Alcheringa.', prize_worth: '[TBD]' }
    ]
  },
  voguenation: {
    name: 'Vogue Nation',
    competitions: [
      { id: 'vn-1', event_name: 'Haute Couture', competetion: 'Haute Couture', image: DEFAULT_IMAGE, module: 'Vogue Nation', desc: 'Premier fashion choreography championship with couture elegance.', prize_worth: '[TBD]' },
      { id: 'vn-2', event_name: 'State of Dress', competetion: 'State of Dress', image: DEFAULT_IMAGE, module: 'Vogue Nation', desc: 'Theme-based styling, avant-garde concepts, and sustainable fashion.', prize_worth: '[TBD]' },
      { id: 'vn-3', event_name: 'Glamour Nova', competetion: 'Glamour Nova', image: DEFAULT_IMAGE, module: 'Vogue Nation', desc: 'Solo modeling pageant searching for stage poise, style, and attitude.', prize_worth: '[TBD]' },
      { id: 'vn-4', event_name: 'Runway Riot', competetion: 'Runway Riot', image: DEFAULT_IMAGE, module: 'Vogue Nation', desc: 'Experimental streetwear and haute couture blended in pure style.', prize_worth: '[TBD]' }
    ]
  },
  arttalkies: {
    name: 'Art Talkies',
    competitions: [
      { id: 'at-1', event_name: 'Live Sketching', competetion: 'Live Sketching', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Charcoal, graphite, and raw observational live drawing showcase.', prize_worth: '[TBD]' },
      { id: 'at-2', event_name: 'Clay Modelling', competetion: 'Clay Modelling', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Shape raw terracotta clay into 3D sculpting masterpieces.', prize_worth: '[TBD]' },
      { id: 'at-3', event_name: 'Face Art', competetion: 'Face Art', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Transform human faces into expressive, vibrant works of art.', prize_worth: '[TBD]' },
      { id: 'at-4', event_name: 'Rangoli', competetion: 'Rangoli', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Intricate traditional floor patterns crafted with vivid colors.', prize_worth: '[TBD]' },
      { id: 'at-5', event_name: 'Ink the Tee', competetion: 'Ink the Tee', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Custom apparel and graphic t-shirt designing competition.', prize_worth: '[TBD]' },
      { id: 'at-6', event_name: 'Graffiti', competetion: 'Graffiti', image: DEFAULT_IMAGE, module: 'Art Talkies', desc: 'Urban street art, spray cans, and monumental mural creations.', prize_worth: '[TBD]' }
    ]
  },
  literary: {
    name: 'Literary',
    competitions: [
      { id: 'lit-1', event_name: 'Comic Clash', competetion: 'Comic Clash', image: DEFAULT_IMAGE, module: 'Literary', desc: 'Witty comebacks, stand-up storytelling, and humor galore.', prize_worth: '[TBD]' },
      { id: 'lit-2', event_name: 'Parliamentary Debate', competetion: 'Parliamentary Debate', image: DEFAULT_IMAGE, module: 'Literary', desc: 'Sharp rhetoric and intellectual argumentation on global issues.', prize_worth: '[TBD]' },
      { id: 'lit-3', event_name: 'Poetry Slam-Hindi', competetion: 'Poetry Slam-Hindi', image: DEFAULT_IMAGE, module: 'Literary', desc: 'Soul-stirring verses, emotions, and spoken word in Hindi.', prize_worth: '[TBD]' },
      { id: 'lit-4', event_name: 'Poetry Slam-English', competetion: 'Poetry Slam-English', image: DEFAULT_IMAGE, module: 'Literary', desc: 'Spoken word poetry competition demanding cadence and power.', prize_worth: '[TBD]' }
    ]
  },
  sports: {
    name: 'Sports',
    competitions: [
      { id: 'sp-1', event_name: '5 on 5 Football', competetion: '5 on 5 Football', image: DEFAULT_IMAGE, module: 'Sports', desc: 'Fast-paced turf football with quick touches and thrilling goals.', prize_worth: '[TBD]' },
      { id: 'sp-2', event_name: 'Arm Wrestling', competetion: 'Arm Wrestling', image: DEFAULT_IMAGE, module: 'Sports', desc: 'Raw strength and wrist power clash on the iron table.', prize_worth: '[TBD]' },
      { id: 'sp-3', event_name: 'Gully Cricket', competetion: 'Gully Cricket', image: DEFAULT_IMAGE, module: 'Sports', desc: 'The spirit of classic street cricket with high-intensity overs.', prize_worth: '[TBD]' },
      { id: 'sp-4', event_name: '3 on 3 Basketball', competetion: '3 on 3 Basketball', image: DEFAULT_IMAGE, module: 'Sports', desc: 'Half-court hoops, fast breaks, and slam dunks.', prize_worth: '[TBD]' }
    ]
  },
  digital: {
    name: 'Digital',
    competitions: [
      { id: 'dig-1', event_name: 'Headline Hustle', competetion: 'Headline Hustle', image: DEFAULT_IMAGE, module: 'Digital', desc: 'Journalistic writing, breaking news coverage, and reporting.', prize_worth: '[TBD]' },
      { id: 'dig-2', event_name: 'Alcher Diva/Hunk', competetion: 'Alcher Diva/Hunk', image: DEFAULT_IMAGE, module: 'Digital', desc: 'Social media influencer and digital personality competition.', prize_worth: '[TBD]' },
      { id: 'dig-3', event_name: 'Doodle Pad', competetion: 'Doodle Pad', image: DEFAULT_IMAGE, module: 'Digital', desc: 'Digital illustration, concept sketching, and digital painting.', prize_worth: '[TBD]' }
    ]
  },
  lca: {
    name: 'Lights Camera Action',
    competitions: [
      { id: 'lca-1', event_name: 'AlcherFrame', competetion: 'AlcherFrame', image: DEFAULT_IMAGE, module: 'Lights Camera Action', desc: 'Short film making championship celebrating creative cinema.', prize_worth: '[TBD]' },
      { id: 'lca-2', event_name: 'Just reel it', competetion: 'Just reel it', image: DEFAULT_IMAGE, module: 'Lights Camera Action', desc: 'Short-form video, Instagram reels, and creative transitions.', prize_worth: '[TBD]' },
      { id: 'lca-3', event_name: 'Vlog Verse', competetion: 'Vlog Verse', image: DEFAULT_IMAGE, module: 'Lights Camera Action', desc: 'Festival storytelling through captivating vlogging.', prize_worth: '[TBD]' }
    ]
  },
  quiz: {
    name: 'Quiz',
    competitions: [
      { id: 'qz-1', event_name: 'General Quiz', competetion: 'General Quiz', image: DEFAULT_IMAGE, module: 'Quiz', desc: 'Trivia across history, science, pop culture, and current affairs.', prize_worth: '[TBD]' },
      { id: 'qz-2', event_name: 'Business Quiz', competetion: 'Business Quiz', image: DEFAULT_IMAGE, module: 'Quiz', desc: 'Corporate trivia, branding, finance, and market strategies.', prize_worth: '[TBD]' },
      { id: 'qz-3', event_name: 'Comic Quiz', competetion: 'Comic Quiz', image: DEFAULT_IMAGE, module: 'Quiz', desc: 'Anime, Marvel, DC, gaming, and comic book lore showdown.', prize_worth: '[TBD]' }
    ]
  }
};

// Default fallback matching the Figma mockup screenshot directly
export const DEFAULT_MOCK_COMPETITIONS = [
  { id: 'mock-1', event_name: 'STAGE CRAFT', competetion: 'STAGE CRAFT', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Theatre that hits harder than a punchline. Stage your best act, from monologue to full ensemble.', prize_worth: '[TBD]' },
  { id: 'mock-2', event_name: 'ABCD', competetion: 'ABCD', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Anybody can dance, but can you own the floor? Solo and crew rounds, all styles welcome.', prize_worth: '[TBD]' },
  { id: 'mock-3', event_name: 'CLASS APART', competetion: 'CLASS APART', image: DEFAULT_IMAGE, module: 'Class Apart', desc: "Talent that doesn't fit in a box. Beatbox, stand-up, magic, whatever makes you you.", prize_worth: '[TBD]' },
  { id: 'mock-4', event_name: 'MUSIC', competetion: 'MUSIC', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'From acoustic harmonies to thunderous rock riffs, bring your melody to life on the grand stage.', prize_worth: '[TBD]' },
  { id: 'mock-5', event_name: 'VOUGE NATION', competetion: 'VOUGE NATION', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'High fashion meets fierce attitude. Strut the runway with sheer elegance and bespoke style.', prize_worth: '[TBD]' },
  { id: 'mock-6', event_name: 'ART TALKIES', competetion: 'ART TALKIES', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Unleash your creativity on canvas, clay, and walls with strokes of pure imagination.', prize_worth: '[TBD]' },
  { id: 'mock-7', event_name: 'ROCK-O-PHONIX', competetion: 'ROCK-O-PHONIX', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'The biggest rock and metal band battle in Eastern India.', prize_worth: '[TBD]' },
  { id: 'mock-8', event_name: 'RAP BATTLE', competetion: 'RAP BATTLE', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'Spit bars, rhymes, and rhythms in an electrifying freestyle rap faceoff.', prize_worth: '[TBD]' },
  { id: 'mock-9', event_name: 'CROSSFADE', competetion: 'CROSSFADE', image: DEFAULT_IMAGE, module: 'Class Apart', desc: 'DJing and electronic music production face-off on the turntables.', prize_worth: '[TBD]' }
];

export const getMockCompetitions = (moduleSlug) => {
  if (!moduleSlug) {
    return {
      moduleName: 'MODULE NAME',
      competitions: DEFAULT_MOCK_COMPETITIONS
    };
  }

  const cleanKey = moduleSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (MOCK_MODULES_DATA[cleanKey]) {
    return {
      moduleName: MOCK_MODULES_DATA[cleanKey].name,
      competitions: MOCK_MODULES_DATA[cleanKey].competitions
    };
  }

  // If slug exists but not directly mapped, generate formatted title & cards
  const formattedName = moduleSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    moduleName: formattedName,
    competitions: DEFAULT_MOCK_COMPETITIONS.map((c, i) => ({
      ...c,
      id: `${cleanKey}-${i + 1}`,
      module: formattedName
    }))
  };
};


export const findCompetitionById = (targetId) => {
  if (!targetId) return null;
  const cleanTarget = String(targetId).toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Search in all modules
  for (const modKey of Object.keys(MOCK_MODULES_DATA)) {
    const mod = MOCK_MODULES_DATA[modKey];
    for (const comp of mod.competitions) {
      const compIdClean = String(comp.id).toLowerCase().replace(/[^a-z0-9]/g, '');
      const compNameClean = String(comp.event_name || comp.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (compIdClean === cleanTarget || compNameClean === cleanTarget) {
        return {
          ...comp,
          moduleName: mod.name,
          solo_or_group: comp.solo_or_group || 'Group',
          event_mode: comp.event_mode || 'On Ground',
          min_members: comp.min_members || 5,
          max_members: comp.max_members || 10,
        };
      }
    }
  }

  // 2. Search in default mock competitions
  for (const comp of DEFAULT_MOCK_COMPETITIONS) {
    const compIdClean = String(comp.id).toLowerCase().replace(/[^a-z0-9]/g, '');
    const compNameClean = String(comp.event_name || comp.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (compIdClean === cleanTarget || compNameClean === cleanTarget) {
      return {
        ...comp,
        moduleName: comp.module || 'Class Apart',
        solo_or_group: 'Group',
        event_mode: 'On Ground',
        min_members: 5,
        max_members: 10,
      };
    }
  }

  // 3. Fallback: formatted title from targetId
  const formattedTitle = String(targetId)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: targetId,
    event_name: formattedTitle,
    moduleName: 'MODULE',
    desc: 'Cheesecake shortbread bonbon bonbon cake croissant jelly beans cake. Cookie tootsie roll muffin pie chupa chups dessert marshmallow chocolate bar. Powder chocolate cake toffee pie gingerbread.',
    solo_or_group: 'Group',
    event_mode: 'On Ground',
    min_members: 5,
    max_members: 10,
    prize_worth: '[TBD]'
  };
};
