
export type KindredPost = {
  id: string;
  authorUid?: string;
  creator: string;
  username: string;
  avatar: string;
  avatarColor: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
};

export const posts: KindredPost[] = [
  {
    id: "post-1",
    creator: "Moss & Moon",
    username: "mossandmoon",
    avatar: "M",
    avatarColor: "#e5eddc",
    time: "2 hours ago",
    content:
      "Spent the afternoon painting little mushrooms and woodland flowers. I think I could happily draw tiny forest things forever. 🍄",
    tags: ["illustration", "forest", "nature"],
    likes: 24,
    comments: 6,
  },
  {
    id: "post-2",
    creator: "PaperCrow",
    username: "papercrow",
    avatar: "P",
    avatarColor: "#f0dfe8",
    time: "5 hours ago",
    content:
      "Does anyone else create entire worlds in their head and then realise they have absolutely no idea how to explain them to another person? Currently attempting to write down the lore before I forget everything.",
    tags: ["writing", "worldbuilding", "fantasy"],
    likes: 41,
    comments: 12,
  },
  {
    id: "post-3",
    creator: "Little Fern Studio",
    username: "littlefernstudio",
    avatar: "F",
    avatarColor: "#e2e8f2",
    time: "Yesterday",
    content:
      "Little frog friend finished! I'm thinking of making a whole collection of woodland creatures. What animals would you like to see next?",
    tags: ["handmade", "crochet", "frogs"],
    likes: 67,
    comments: 18,
  },
  {
    id: "post-4",
    creator: "PixelWitch",
    username: "pixelwitch",
    avatar: "W",
    avatarColor: "#e8e1f1",
    time: "Yesterday",
    content:
      "Working on a tiny village tileset for my game. I love how much personality you can fit into such a small number of pixels.",
    tags: ["gamedev", "pixelart", "indiedev"],
    likes: 32,
    comments: 9,
  },
];
