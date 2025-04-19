// Define types based on the Mongoose schema
export interface User {
  _id: string
  name: string
  avatar: string
  level: number
}

// Updated to include media type and thumbnail
export interface MediaItem {
  url: string
  type: "image" | "video"
  thumbnailUrl?: string // Thumbnail for video
}

export interface Gig {
  _id: string
  freelancerId: string
  title: string
  description: string
  keywords: string[]
  price: {
    toString: () => string
  }
  media: MediaItem[] // Updated to use MediaItem type
  duration: number
  status: "pending" | "approved" | "rejected" | "hidden" | "deleted"
  category_id: string
  approved_by: string | null
  rejected_by: string | null
  rejected_at: Date | null
  approved_at: Date | null
  createdAt: Date
  updatedAt: Date
  freelancer?: User
  rating?: {
    average: number
    count: number
  }
}

// Sample users data with real avatar images
export const sampleUsers: User[] = [
  {
    _id: "user1",
    name: "Angelina P",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    level: 2,
  },
  {
    _id: "user2",
    name: "Michael T",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    level: 3,
  },
  {
    _id: "user3",
    name: "Sarah J",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
    level: 1,
  },
  {
    _id: "user4",
    name: "David K",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    level: 2,
  },
  {
    _id: "user5",
    name: "Emma L",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    level: 4,
  },
]

// Sample gigs data with video URLs and thumbnails
export const sampleGigs: Gig[] = [
  {
    _id: "gig1",
    freelancerId: "user1",
    title: "I will make a natural spokesperson ugc video content for your brand",
    description:
      "Professional video content creation for your brand or product. I will create authentic, engaging UGC-style videos that showcase your product or service in a natural and relatable way.",
    keywords: ["video", "spokesperson", "ugc", "content", "marketing"],
    price: { toString: () => "20" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },

      {
        url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 3,
    status: "approved",
    category_id: "video",
    approved_by: "admin1",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-10-15"),
    createdAt: new Date("2023-10-10"),
    updatedAt: new Date("2023-10-15"),
    freelancer: sampleUsers[0],
    rating: {
      average: 4.9,
      count: 1200,
    },
  },
  {
    _id: "gig2",
    freelancerId: "user2",
    title: "I will design a professional logo for your business",
    description:
      "I will create a unique, modern, and professional logo design for your business or brand that stands out from the competition.",
    keywords: ["logo", "design", "branding", "graphic design"],
    price: { toString: () => "35" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1600416516441-7fceec13985a?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 2,
    status: "approved",
    category_id: "design",
    approved_by: "admin2",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-09-20"),
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-09-20"),
    freelancer: sampleUsers[1],
    rating: {
      average: 4.8,
      count: 850,
    },
  },
  {
    _id: "gig3",
    freelancerId: "user3",
    title: "I will write SEO-optimized blog content for your website",
    description:
      "I will create high-quality, SEO-friendly blog posts and articles that will help improve your website's search engine rankings and engage your audience.",
    keywords: ["content writing", "blog", "SEO", "copywriting"],
    price: { toString: () => "25" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/iwdmxnl1tuyqbvah4oi6",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 4,
    status: "approved",
    category_id: "writing",
    approved_by: "admin1",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-11-05"),
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-05"),
    freelancer: sampleUsers[2],
    rating: {
      average: 4.7,
      count: 320,
    },
  },
  {
    _id: "gig4",
    freelancerId: "user4",
    title: "I will develop a responsive website using React and Next.js",
    description:
      "I will build a modern, fast, and responsive website using React and Next.js that will provide an excellent user experience across all devices.",
    keywords: ["web development", "React", "Next.js", "frontend"],
    price: { toString: () => "120" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/gtf5rpr1dsytjzx5z3ae",
        type: "video",
        thumbnailUrl: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/gtf5rpr1dsytjzx5z3ae",
      },
      {
        url: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 7,
    status: "approved",
    category_id: "programming",
    approved_by: "admin3",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-10-25"),
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-25"),
    freelancer: sampleUsers[3],
    rating: {
      average: 5.0,
      count: 78,
    },
  },
  {
    _id: "gig5",
    freelancerId: "user5",
    title: "I will create social media content strategy for your business",
    description:
      "I will develop a comprehensive social media content strategy that will help you grow your online presence, engage your audience, and drive conversions.",
    keywords: ["social media", "marketing", "content strategy", "digital marketing"],
    price: { toString: () => "75" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
      },
      {
        url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 5,
    status: "approved",
    category_id: "marketing",
    approved_by: "admin2",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-11-10"),
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-10"),
    freelancer: sampleUsers[4],
    rating: {
      average: 4.9,
      count: 430,
    },
  },
  {
    _id: "gig6",
    freelancerId: "user6",
    title: "I will create social media content strategy for your business",
    description:
      "I will develop a comprehensive social media content strategy that will help you grow your online presence, engage your audience, and drive conversions.",
    keywords: ["social media", "marketing", "content strategy", "digital marketing"],
    price: { toString: () => "75" },
    media: [
      {
        url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        type: "video",
        thumbnailUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      },
      {
        url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop",
        type: "image",
      },
    ],
    duration: 6,
    status: "approved",
    category_id: "marketing",
    approved_by: "admin2",
    rejected_by: null,
    rejected_at: null,
    approved_at: new Date("2023-11-10"),
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-10"),
    freelancer: sampleUsers[4],
    rating: {
      average: 4.9,
      count: 430,
    },
  },
]

