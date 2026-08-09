import { Product, UserProfile } from '../types';

export const SAMPLE_USER: UserProfile = {
  id: 'usr_demo_882',
  email: 'storeowner@lumina-commerce.com',
  fullName: 'Adaora Okonkwo',
  storeName: 'Lumina Tech Essentials',
  planTier: 'Growth',
  createdAt: '2026-01-15T09:00:00.000Z',
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_aura_001',
    userId: 'usr_demo_882',
    name: 'Aura Sound Pro ANC Wireless Headphones',
    asinOrUrl: 'B08X91LK99 / https://luminastore.com/products/aura-sound-pro',
    category: 'Electronics & Audio',
    createdAt: '2026-02-01T10:30:00.000Z',
    lastAnalyzedAt: '2026-08-07T16:20:00.000Z',
    reviewCount: 184,
    rawReviewCorpus: `5 Stars: The Active Noise Cancellation on these headphones completely blew my mind. I took them on an 8 hour transatlantic flight and couldn't hear the jet engines at all! Sound quality is crisp with punchy bass.
5 Stars: Unboxing experience was top notch. Fast shipping to Lagos in 2 days. The battery lasts well over 35 hours of continuous music.
4 Stars: Great headphones for working from home. Comfortable ear cushions, though after 3 hours the top headband feels slightly tight on my crown.
1 Star: Took 15 minutes to pair with my MacBook and phone at the same time. The quick start guide is way too small to read without a magnifying glass!
5 Stars: Better than my $250 Bose QC45s for half the cost! Really impressed with the mic clarity on Zoom calls.
2 Stars: Headband is snug. If you have a larger head size like me, it exerts a bit of pressure. Otherwise sound is decent.
5 Stars: Sturdy build, dropped it on tile twice and zero scratches.
1 Star: Delivery box arrived slightly crushed on one corner, though item inside was safe. Wish courier packaging was stiffer.`,
    latestAnalysis: {
      overallSentimentScore: 86,
      summaryHeadline: 'Exceptional noise cancellation and audio performance praised heavily, though headband tension and Bluetooth multi-device setup instructions need refinement.',
      totalReviewsAnalyzed: 184,
      ratingDistribution: {
        star5: 64,
        star4: 20,
        star3: 8,
        star2: 5,
        star1: 3,
      },
      strengths: [
        {
          id: 's1',
          title: 'Class-Leading Active Noise Cancellation',
          category: 'Audio Quality',
          percentage: 92,
          summary: 'Mutes airplane jet noise, busy office chatter, and city traffic seamlessly.',
          quotes: [
            'The ANC completely muted my 8-hour transatlantic flight engines!',
            'Silences office background noise better than my $250 Bose pair.',
          ],
        },
        {
          id: 's2',
          title: 'Monster 35+ Hour Battery Endurance',
          category: 'Durability',
          percentage: 88,
          summary: 'Users go a full workweek on a single USB-C charge.',
          quotes: [
            'Charged it once on Monday and it is still at 40% on Friday evening!',
            'Battery life indicator is super accurate.',
          ],
        },
        {
          id: 's3',
          title: 'High-Value Mic Clarity for Virtual Calls',
          category: 'Performance',
          percentage: 85,
          summary: 'Clear voice isolation on Zoom and Google Meet without background echo.',
          quotes: [
            'My coworkers remarked on how clear my voice sounded during our team call.',
          ],
        },
        {
          id: 's4',
          title: 'Sleek Aesthetic & Premium Unboxing',
          category: 'Packaging',
          percentage: 82,
          summary: 'Matte tactile finish with rigid protective travel case.',
          quotes: [
            'Unboxing felt premium, like buying a luxury tech gadget.',
          ],
        },
        {
          id: 's5',
          title: 'Rapid 2-Day Delivery',
          category: 'Shipping',
          percentage: 90,
          summary: 'Fulfillment and shipping speed consistently beat customer expectations.',
          quotes: [
            'Ordered on Tuesday, arrived on my doorstep Thursday morning in pristine condition.',
          ],
        },
      ],
      complaints: [
        {
          id: 'c1',
          title: 'Headband Clamp Pressure During Long Sessions',
          category: 'Sizing & Fit',
          percentage: 22,
          summary: 'Users with larger hat sizes report mild top-of-head pressure after 2+ hours.',
          quotes: [
            'After 3 hours of continuous wear, the top headband cushion exerts slight pressure.',
            'Headband is snug for larger head sizes.',
          ],
        },
        {
          id: 'c2',
          title: 'Tiny Quick-Start Guide Font',
          category: 'Ease of Use',
          percentage: 16,
          summary: 'Small printed booklet makes initial multi-point Bluetooth pairing unclear.',
          quotes: [
            'The quick start manual print is so tiny I had to use my phone camera zoom!',
          ],
        },
        {
          id: 'c3',
          title: 'Courier Outer Box Compression',
          category: 'Shipping',
          percentage: 8,
          summary: 'A small fraction of shipping cartons showed corner crushing during transit.',
          quotes: [
            'Delivery box arrived slightly crushed on one corner.',
          ],
        },
      ],
      featureMentions: [
        { feature: 'Audio Quality', positive: 94, negative: 6, totalCount: 142 },
        { feature: 'Price & Value', positive: 91, negative: 9, totalCount: 98 },
        { feature: 'Durability', positive: 88, negative: 12, totalCount: 76 },
        { feature: 'Shipping & Delivery', positive: 90, negative: 10, totalCount: 54 },
        { feature: 'Packaging', positive: 86, negative: 14, totalCount: 42 },
        { feature: 'Sizing & Fit', positive: 72, negative: 28, totalCount: 68 },
        { feature: 'Ease of Use', positive: 78, negative: 22, totalCount: 36 },
      ],
      competitorMentions: [
        {
          competitorName: 'Bose QuietComfort 45',
          mentionCount: 24,
          sentiment: 'Favorable to Us',
          quote: 'Better noise reduction than my $250 Bose QC45s for half the cost!',
          context: 'Price-to-performance noise cancellation comparison',
        },
        {
          competitorName: 'Sony WH-1000XM4',
          mentionCount: 16,
          sentiment: 'Neutral/Favorable',
          quote: 'Bass profile is punchier than default Sony settings out of the box.',
          context: 'Default EQ & acoustic tuning',
        },
      ],
      actionPlan: [
        {
          priority: 'High',
          title: 'Add Ergonomic Memory Foam Sleeve Option to V2 Batch',
          description: 'Upgrade the top headband cushion density to soft memory foam to eliminate clamp pressure feedback on larger head sizes.',
          impact: 'Reduces comfort complaints by an estimated ~30%',
          completed: false,
        },
        {
          priority: 'Medium',
          title: 'Include Large-Format Quick Pairing Card & Video QR Code',
          description: 'Print a postcard-sized quick pairing cheat-sheet with a QR code linking to a 30-second setup video for seamless dual-device connection.',
          impact: 'Decreases setup support tickets by ~25%',
          completed: true,
        },
        {
          priority: 'Medium',
          title: 'Highlight 35+ Hour Battery in Amazon A+ Content',
          description: 'Create a dedicated infographic showcasing battery life vs competitors to drive higher page conversions.',
          impact: 'Boosts product listing conversion rate by ~4%',
          completed: false,
        },
      ],
      replyTemplates: [
        {
          id: 'r1',
          targetReviewRating: 1,
          issueFocus: 'Bluetooth Pairing Instructions',
          sampleReviewQuote: 'Took 15 minutes to pair with my laptop. Guide is tiny.',
          suggestedReply: 'Hi! Thank you for sharing your experience. We sincerely apologize for the setup frustration! To pair immediately with multiple devices, hold the power button for 4 seconds until the blue LED blinks rapidly. We also have a 30-second video guide — please reach out to us at support@aurasound.com so we can send you the link and make sure your headset connects instantly!',
        },
        {
          id: 'r2',
          targetReviewRating: 2,
          issueFocus: 'Headband Tightness / Snug Fit',
          sampleReviewQuote: 'Headband is snug for larger head sizes.',
          suggestedReply: 'Hi there, thanks for your honest review! We appreciate your feedback regarding the headband tension. We offer a soft stretch cushion pad free of charge for our customers. Please contact our support team at support@aurasound.com and we will ship one out to you right away!',
        },
        {
          id: 'r3',
          targetReviewRating: 1,
          issueFocus: 'Shipping Box Corner Damage',
          sampleReviewQuote: 'Delivery box arrived slightly crushed.',
          suggestedReply: 'Hello, we are so sorry your shipping carton arrived damaged by the courier. While we are glad the headphones inside remained safe, we want every customer to receive a 100% pristine package. Please drop us a line at support@aurasound.com with your order number so we can send a goodwill gift!',
        },
      ],
    },
  },
  {
    id: 'prod_hydro_002',
    userId: 'usr_demo_882',
    name: 'HydroSteel 32oz Vacuum Insulated Water Bottle',
    asinOrUrl: 'B07V90KK12 / https://luminastore.com/products/hydrosteel-32oz',
    category: 'Home & Kitchen / Fitness',
    createdAt: '2026-03-10T14:15:00.000Z',
    lastAnalyzedAt: '2026-08-05T11:00:00.000Z',
    reviewCount: 92,
    rawReviewCorpus: `5 Stars: Ice stays frozen for over 24 hours even in 35C West African heat! Super sturdy bottle.
5 Stars: Straw lid doesn't leak at all in my gym bag.
3 Stars: The bottle is fantastic, but it's a bit too wide to fit in standard car cup holders.
1 Star: The rubber ring inside the lid started smelling musty after 2 weeks because it's hard to remove for washing.`,
    latestAnalysis: {
      overallSentimentScore: 80,
      summaryHeadline: 'Ice retention performance and leak-proof lid earn rave reviews, but cup holder compatibility and lid gasket cleaning are key customer friction points.',
      totalReviewsAnalyzed: 92,
      ratingDistribution: {
        star5: 58,
        star4: 22,
        star3: 12,
        star2: 5,
        star1: 3,
      },
      strengths: [
        {
          id: 's1',
          title: '24+ Hour Ice Thermal Insulation',
          category: 'Quality',
          percentage: 94,
          summary: 'Keeps water ice-cold all day in tropical summer temperatures.',
          quotes: [
            'Ice stays frozen for over 24 hours even in 35C West African heat!',
          ],
        },
        {
          id: 's2',
          title: '100% Leak-Proof Straw Lid',
          category: 'Durability',
          percentage: 88,
          summary: 'Zero spills when tossed upside down inside gym duffels or backpacks.',
          quotes: [
            'Straw lid doesn\'t leak at all in my gym bag.',
          ],
        },
      ],
      complaints: [
        {
          id: 'c1',
          title: 'Doesn\'t Fit Standard Car Cup Holders',
          category: 'Sizing & Fit',
          percentage: 32,
          summary: '32oz diameter is slightly too wide for standard automobile cup slots.',
          quotes: [
            'The bottle is fantastic, but it\'s a bit too wide to fit in standard car cup holders.',
          ],
        },
        {
          id: 'c2',
          title: 'Lid Rubber Gasket Washing Accessibility',
          category: 'Ease of Use',
          percentage: 18,
          summary: 'Silicone seal ring requires a small pick tool to remove for deep washing.',
          quotes: [
            'The rubber ring inside the lid is hard to remove for washing.',
          ],
        },
      ],
      featureMentions: [
        { feature: 'Quality', positive: 92, negative: 8, totalCount: 78 },
        { feature: 'Price & Value', positive: 85, negative: 15, totalCount: 44 },
        { feature: 'Sizing & Fit', positive: 65, negative: 35, totalCount: 52 },
        { feature: 'Ease of Use', positive: 75, negative: 25, totalCount: 30 },
      ],
      competitorMentions: [
        {
          competitorName: 'Hydro Flask 32oz',
          mentionCount: 12,
          sentiment: 'Favorable to Us',
          quote: 'Matches Hydro Flask insulation at half the price.',
          context: 'Price comparison',
        },
      ],
      actionPlan: [
        {
          priority: 'High',
          title: 'Include Silicone Gasket Removal Pull Tab & Cleaning Brush',
          description: 'Modify silicone ring mold with an extended pull tab and include a miniature straw cleaning brush in the package.',
          impact: 'Solves top hygiene complaint and increases repeat purchases',
          completed: false,
        },
        {
          priority: 'Medium',
          title: 'Launch Car Cup Holder Expander Bundle',
          description: 'Offer an optional base adapter accessory on Shopify/Amazon storefront.',
          impact: 'Unlocks cross-sell revenue',
          completed: false,
        },
      ],
      replyTemplates: [
        {
          id: 'r1',
          targetReviewRating: 1,
          issueFocus: 'Lid Gasket Cleaning',
          sampleReviewQuote: 'Rubber ring is hard to remove for washing.',
          suggestedReply: 'Hi! Thank you for letting us know. To remove the lid gasket safely, gently use a spoon handle or soft tab. We are also happy to mail you a complimentary lid cleaning kit! Please reach out to support@luminastore.com.',
        },
      ],
    },
  },
];
