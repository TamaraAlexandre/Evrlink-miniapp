// Dynamic greeting cards data structure
// Each category contains multiple greeting cards with their own data

export interface GreetingCardData {
  id: string;
  title: string;
  byline: string;
  tags: string[];
  likes: number;
  cta: string;
  paperImage: string;
  overlayImage: string;
  brandIcon: string;
  tapeText: string;
  description?: string;
  price: string;
  useImageBackground?: boolean; // If true, use backgroundImage instead of background color
  backgroundImage?: string; // Image URL to use as background when useImageBackground is true
}

export interface CategoryData {
  title: string;
  subtitle: string;
  cards: GreetingCardData[];
}

export const greetingCardsData: Record<string, CategoryData> = {
  birthday: {
    title: "Birthday Cards",
    subtitle: "Celebrate special moments with personalized birthday greetings.",
    cards: [
      {
        id: "birthday-1",
        title: "Birthday",
        byline: "by Evrlink",
        tags: ["#birthday", "#celebration"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/birthday/HappyBirthday7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/birthday.svg",
        tapeText: "HAPPY BIRTHDAY!!",
        description: "A delightful birthday celebration card",
        price: "0.02 ETH"
      },
      {
        id: "birthday-2",
        title: "Birthday",
        byline: "by Evrlink",
        tags: ["#birthday", "#cake"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/birthday/birthday1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/birthday.svg",
        tapeText: "MAKE A WISH!",
        description: "Sweet birthday wishes with cake",
        price: "0.02 ETH"
      },
      {
        id: "birthday-3",
        title: "Birthday",
        byline: "by Evrlink",
        tags: ["#birthday", "#party"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/birthday/birthday2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/birthday.svg",
        tapeText: "PARTY TIME!",
        description: "Let's celebrate in style",
        price: "0.02 ETH"
      },
      {
        id: "birthday-4",
        title: "Birthday",
        byline: "by Evrlink",
        tags: ["#birthday", "#party"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/birthday/bIirthday3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/birthday.svg",
        tapeText: "PARTY TIME!",
        description: "Let's celebrate in style",
        price: "0.02 ETH"
      }
    ]
  },

  congrats: {
    title: "Congratulations Cards",
    subtitle: "Celebrate achievements and milestones with style.",
    cards: [
      {
        id: "congrats-1",
        title: "Congratulations",
        byline: "by Evrlink",
        tags: ["#congrats", "#achievement"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/congrats/congrats1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/congrats.svg",
        tapeText: "CONGRATS!!",
        description: "Celebrate your success",
        price: "0.02 ETH"
      },
      {
        id: "congrats-2",
        title: "Congratulations",
        byline: "by Evrlink",
        tags: ["#congrats", "#success"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/congrats/congrats2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/congrats.svg",
        tapeText: "WELL DONE!",
        description: "Outstanding work deserves recognition",
        price: "0.02 ETH"
      },
    //   {
    //     id: "congrats-3",
    //     title: "Milestone Reached",
    //     byline: "by Evrlink",
    //     tags: ["#congrats", "#milestone"],
    //     likes: 45,
    //     cta: "Choose Card",
    //     paperImage: "/images/slider1.png",
    //     overlayImage: "/images/loffy.png",
    //     brandIcon: "/images/congrats.svg",
    //     tapeText: "MILESTONE!",
    //     description: "Another goal achieved"
    //   }
    ]
  },

  love: {
    title: "Love & Romance",
    subtitle: "Express your feelings with heartfelt cards.",
    cards: [
      {
        id: "love-1",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#romance"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "I LOVE\nYOU!",
        description: "Express your deepest feelings",
        price: "0.02 ETH"
      },
      {
        id: "love-2",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#sweet"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "SWEET\nDREAMS",
        description: "Dreamy love messages",
        price: "0.02 ETH"
      },
      {
        id: "love-3",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-4",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-5",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-6",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love6.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-7",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-8",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love8.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-9",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love9.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      },
      {
        id: "love-10",
        title: "Love",
        byline: "by Evrlink",
        tags: ["#love", "#forever"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/love/love10.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/love.svg",
        tapeText: "FOREVER\nYOURS",
        description: "Eternal love and commitment",
        price: "0.02 ETH"
      }
    ]
  },

  work: {
    title: "Professional Cards",
    subtitle: "Business and work-related greetings.",
    cards: [
      {
        id: "work-1",
        title: "Work",
        byline: "by Evrlink",
        tags: ["#work", "#professional"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/work/work1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/work.svg",
        tapeText: "GOOD\nWORK!",
        description: "Professional achievement recognition",
        price: "0.02 ETH"
      },
      {
        id: "work-2",
        title: "Work",
        byline: "by Evrlink",
        tags: ["#work", "#team"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/work/work2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/work.svg",
        tapeText: "TEAM\nPLAYER!",
        description: "Celebrate teamwork and collaboration",
        price: "0.02 ETH"
      },
      {
        id: "work-3",
        title: "Work",
        byline: "by Evrlink",
        tags: ["#work", "#promotion"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/work/work3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/work.svg",
        tapeText: "PROMOTION!",
        description: "Congratulations on your promotion",
        price: "0.02 ETH"
      },
      {
        id: "work-4",
        title: "Work",
        byline: "by Evrlink",
        tags: ["#work", "#promotion"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/work/work4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/work.svg",
        tapeText: "PROMOTION!",
        description: "Congratulations on your promotion",
        price: "0.02 ETH"
      }
    ]
  },

  thanks: {
    title: "Thank You Cards",
    subtitle: "Show gratitude and appreciation.",
    cards: [
      {
        id: "thanks-1",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#gratitude"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "THANK\nYOU!",
        description: "Express heartfelt gratitude",
        price: "0.02 ETH"
      },
      {
        id: "thanks-2",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-3",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-4",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-5",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-6",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou6.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-7",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      },
      {
        id: "thanks-8",
        title: "Thank You",
        byline: "by Evrlink",
        tags: ["#thanks", "#appreciation"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/thankyou/thankyou8.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/thanks.svg",
        tapeText: "MUCH\nAPPRECIATED",
        description: "Show your appreciation",
        price: "0.02 ETH"
      }
    ]
  },

  sorry: {
    title: "Apology Cards",
    subtitle: "Make amends with sincere apologies.",
    cards: [
      {
        id: "sorry-1",
        title: "Sorry",
        byline: "by Evrlink",
        tags: ["#sorry", "#apology"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/sorry/sorry1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/sorry.svg",
        tapeText: "I'M\nSORRY",
        description: "A heartfelt apology",
        price: "0.02 ETH"
      },
      {
        id: "sorry-2",
        title: "Sorry",
        byline: "by Evrlink",
        tags: ["#sorry", "#mistake"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/sorry/sorry2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/sorry.svg",
        tapeText: "MY\nMISTAKE",
        description: "Taking responsibility",
        price: "0.02 ETH"
      },
      {
        id: "sorry-3",
        title: "Sorry",
        byline: "by Evrlink",
        tags: ["#sorry", "#apology"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/sorry/sorry3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/sorry.svg",
        tapeText: "I'M\nSORRY",
        description: "A heartfelt apology",
        price: "0.02 ETH"
      },
      {
        id: "sorry-4",
        title: "Sorry",
        byline: "by Evrlink",
        tags: ["#sorry", "#mistake"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/sorry/sorry4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/sorry.svg",
        tapeText: "MY\nMISTAKE",
        description: "Taking responsibility",
        price: "0.02 ETH"
      },
      {
        id: "sorry-5",
        title: "Sorry",
        byline: "by Evrlink",
        tags: ["#sorry", "#apology"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/sorry/sorry5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/sorry.svg",
        tapeText: "I'M\nSORRY",
        description: "A heartfelt apology",
        price: "0.02 ETH"
      },
    ]
  },

  holiday: {
    title: "Holiday Cards",
    subtitle: "Celebrate special occasions and holidays.",
    cards: [
      {
        id: "holiday-1",
        title: "Holiday",
        byline: "by Evrlink",
        tags: ["#holiday", "#celebration"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/irl.svg",
        tapeText: "HOLIDAY\nCHEER!",
        description: "Spread holiday joy",
        price: "0.02 ETH"
      },
      {
        id: "holiday-2",
        title: "Holiday",
        byline: "by Evrlink",
        tags: ["#holiday", "#season"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/irl.svg",
        tapeText: "SEASON'S\nGREETINGS",
        description: "Warm holiday wishes",
        price: "0.02 ETH"
      }
    ]
  },

  situation: {
    title: "Situationship Cards",
    subtitle: "Navigate complex relationships with care.",
    cards: [
      {
        id: "situation-1",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#complicated"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "IT'S\nCOMPLICATED",
        description: "When things are complex",
        price: "0.02 ETH"
      },
      {
        id: "situation-2",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-3",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-4",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-5",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-6",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship6.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-7",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-8",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship8.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-9",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship9.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      },
      {
        id: "situation-10",
        title: "Situationship",
        byline: "by Evrlink",
        tags: ["#situationship", "#mixed"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/situationship/situationship10.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/situation.svg",
        tapeText: "MIXED\nSIGNALS",
        description: "Navigating unclear waters",
        price: "0.02 ETH"
      }
    ]
  },

  friendship: {
    title: "Friendship Cards",
    subtitle: "Celebrate the bonds of friendship.",
    cards: [
      {
        id: "friendship-1",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#bff"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "BEST\nFRIENDS!",
        description: "Celebrate true friendship",
        price: "0.02 ETH"
      },
      {
        id: "friendship-2",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#squad"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "SQUAD\nGOALS!",
        description: "Friendship squad celebration",
        price: "0.02 ETH"
      },
      {
        id: "friendship-3",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#bff"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "BEST\nFRIENDS!",
        description: "Celebrate true friendship",
        price: "0.02 ETH"
      },
      {
        id: "friendship-4",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#squad"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "SQUAD\nGOALS!",
        description: "Friendship squad celebration",
        price: "0.02 ETH"
      },
      {
        id: "friendship-5",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#bff"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "BEST\nFRIENDS!",
        description: "Celebrate true friendship",
        price: "0.02 ETH"
      },
      {
        id: "friendship-6",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#squad"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship6.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "SQUAD\nGOALS!",
        description: "Friendship squad celebration",
        price: "0.02 ETH"
      },
      {
        id: "friendship-7",
        title: "Friendship",
        byline: "by Evrlink",
        tags: ["#friendship", "#squad"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/friendship/friendship7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/friends.svg",
        tapeText: "SQUAD\nGOALS!",
        description: "Friendship squad celebration",
        price: "0.02 ETH"
      }
    ]
  },

  degen: {
    title: "Degen Cards",
    subtitle: "For the crypto enthusiasts and risk-takers.",
    cards: [
      {
        id: "degen-1",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#crypto"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "DEGEN\nVIBES!",
        description: "For the crypto degenerates",
        price: "0.02 ETH"
      },
      {
        id: "degen-2",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#moon"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "TO THE\nMOON!",
        description: "Crypto moon mission",
        price: "0.02 ETH"
      },
      {
        id: "degen-3",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#crypto"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "DEGEN\nVIBES!",
        description: "For the crypto degenerates",
        price: "0.02 ETH"
      },
      {
        id: "degen-4",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#moon"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "TO THE\nMOON!",
        description: "Crypto moon mission",
        price: "0.02 ETH"
      },
      {
        id: "degen-5",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#crypto"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen5.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "DEGEN\nVIBES!",
        description: "For the crypto degenerates",
        price: "0.02 ETH"
      },
      {
        id: "degen-6",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#moon"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen6.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "TO THE\nMOON!",
        description: "Crypto moon mission",
        price: "0.02 ETH"
      },
      {
        id: "degen-7",
        title: "Degen",
        byline: "by Evrlink",
        tags: ["#degen", "#crypto"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/degen/degen7.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/degen.svg",
        tapeText: "DEGEN\nVIBES!",
        description: "For the crypto degenerates",
        price: "0.02 ETH"
      }
    ]
  },

  motivational: {
    title: "Motivational Cards",
    subtitle: "Inspire and uplift with positive messages.",
    cards: [
      {
        id: "motivational-1",
        title: "Motivational",
        byline: "by Evrlink",
        tags: ["#motivation", "#inspiration"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/motivational/motivational1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/motivation.svg",
        tapeText: "RISE &\nSHINE!",
        description: "Start your day with motivation",
        price: "0.02 ETH"
      },
      {
        id: "motivational-2",
        title: "Motivational",
        byline: "by Evrlink",
        tags: ["#motivation", "#perseverance"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/motivational/motivational2.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/motivation.svg",
        tapeText: "NEVER\nGIVE UP!",
        description: "Keep pushing forward",
        price: "0.02 ETH"
      },
      {
        id: "motivational-3",
        title: "Motivational",
        byline: "by Evrlink",
        tags: ["#motivation", "#inspiration"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/motivational/motivational3.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/motivation.svg",
        tapeText: "RISE &\nSHINE!",
        description: "Start your day with motivation",
        price: "0.02 ETH"
      },
      {
        id: "motivational-4",
        title: "Motivational",
        byline: "by Evrlink",
        tags: ["#motivation", "#perseverance"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/categories/motivational/motivational4.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/motivation.svg",
        tapeText: "NEVER\nGIVE UP!",
        description: "Keep pushing forward",
        price: "0.02 ETH"
      }
    ]
  },

  base: {
    title: "Base Ecosystem Cards",
    subtitle: "Celebrate the Base blockchain community.",
    cards: [
      {
        id: "base-1",
        title: "Base",
        byline: "by Evrlink",
        tags: ["#base", "#ecosystem"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/base.svg",
        tapeText: "BASE\nBUILDER!",
        description: "Building on Base",
        price: "0.02 ETH"
      },
      {
        id: "base-2",
        title: "Base",
        byline: "by Evrlink",
        tags: ["#base", "#onchain"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/base.svg",
        tapeText: "ONCHAIN\nLIFE!",
        description: "Living on the blockchain",
        price: "0.02 ETH"
      }
    ]
  },

  others: {
    title: "All Purpose Cards",
    subtitle: "Versatile cards for any occasion or situation.",
    cards: [
      {
        id: "others-1",
        title: "Others",
        byline: "by Evrlink",
        tags: ["#versatile", "#all-purpose"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/others.svg",
        tapeText: "UNIVERSAL\nVIBES!",
        description: "For any occasion",
        price: "0.02 ETH"
      },
      {
        id: "others-2",
        title: "Others",
        byline: "by Evrlink",
        tags: ["#versatile", "#random"],
        likes: 0,
        cta: "Choose Card",
        paperImage: "/images/slider1.png",
        overlayImage: "/images/loffy.png",
        brandIcon: "/images/others.svg",
        tapeText: "JUST\nBECAUSE",
        description: "No reason needed",
        price: "0.02 ETH"
      }
    ]
  }
};

// Helper function to get category data
export function getCategoryData(category: string): CategoryData | null {
  return greetingCardsData[category] || null;
}

// Helper function to get all categories
export function getAllCategories(): string[] {
  return Object.keys(greetingCardsData);
}

// Helper function to get a specific card
export function getCardData(category: string, cardId: string): GreetingCardData | null {
  const categoryData = getCategoryData(category);
  if (!categoryData) return null;
  
  return categoryData.cards.find(card => card.id === cardId) || null;
}

// Highlighted categories data - featuring the best cards from each category
export const highlightedCategoriesData: GreetingCardData[] = [
  {
    id: "highlighted-birthday-1",
    title: "",
    byline: "by normal mfer",
    tags: ["#base", "#card"],
    likes: 0,
    cta: "Choose Card",
    paperImage: "/images/categories/base/base1.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/base.svg",
    tapeText: "HAPPY BIRTHDAY!!",
    description: "A delightful birthday celebration card",
    price: "0.02 ETH"
  },
  {
    id: "highlighted-love-1",
    title: "",
    byline: "by normal mfer",
    tags: ["#love", "#romance"],
    likes: 0,
    cta: "Choose Card",
    paperImage: "/images/categories/base/base2.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/base.svg",
    tapeText: "I LOVE\nYOU!",
    description: "Express your deepest feelings",
    price: "0.02 ETH"
  },
  {
    id: "highlighted-congrats-1",
    title: "",
    byline: "by normal mfer",
    tags: ["#base", "#card"],
    likes: 0,
    cta: "Choose Card",
    paperImage: "/images/categories/base/base3.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/congrats.svg",
    tapeText: "CONGRATS!!",
    description: "Celebrate your success",
    price: "0.02 ETH"
  }
];

// Slider data for the home page
export const sliderData: GreetingCardData[] = [
  {
    id: "slider-1",
    title: "Mingles",
    tags: ["#crypto", "#fun"],
    likes: 0,
    description: "The ultimate crypto party card",
    byline: "by Mr Mingles",
    cta: "Choose Card",
    paperImage: "/images/categories/mingles/mingles1.png",
    overlayImage: "/images/slider1.png",
    brandIcon: "/images/birthday.svg",
    tapeText: "CRYPTO\nPARTY!",
    price: "0.02 ETH",
    useImageBackground: true,
    backgroundImage: "/images/categories/mingles/mingles2.png"
  },
  {
    id: "slider-3",
    title: "Loffy",
    tags: ["#loffy", "#loffylama"],
    likes: 0,
    description: "A delightful birthday celebration card",
    byline: "by Loffyllama",
    cta: "Choose Card",
    paperImage: "/images/slider1.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/loffy.png",
    tapeText: "LOFFY\nBIRTHDAY!",
    price: "0.02 ETH"
  },
  {
    id: "slider-4",
    title: "Base Birthday Bash",
    tags: ["#base", "#party"],
    likes: 0,
    description: "Celebrate with Base ecosystem",
    byline: "by Base",
    cta: "Choose Card",
    paperImage: "/images/slider1.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/base.svg",
    tapeText: "BASE\nBIRTHDAY!",
    price: "0.02 ETH"
  },
];

// Recently Created data for the home page
export const recentlyCreatedData: GreetingCardData[] = [
  {
    id: "recent-1",
    title: "Birthday",
    byline: "by Evrlink",
    tags: ["#birthday", "#celebration"],
    likes: 0,
    cta: "Choose Card",
    paperImage: "/images/slider1.png",
    overlayImage: "/images/loffy.png",
    brandIcon: "/images/birthday.svg",
    tapeText: "BIRTHDAY\nBLING!",
    price: "0.02 ETH"
  }
];
