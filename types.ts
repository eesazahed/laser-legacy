import { ObjectId } from "mongodb";

interface TimestampId {
  _id: string;
  timestamp: number;
}

// users

interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  emailVerified: null;
  ip: string | null;
  public: PublicUser;
}

interface PublicUser {
  _id: string;
  name: string;
  username: string;
  bio: string;
  followers: TimestampId[];
  followerCount: number;
  following: TimestampId[];
  followingCount: number;
  likedPosts: TimestampId[];
  joined: number;
  lastOnline: number;
  admin: boolean;
}

interface BasicUserProfile {
  _id: string;
  name: string;
  username: string;
}

interface FormData {
  name: string;
  username: string;
  bio: string;
}

interface Follower {
  username: string;
  _id: string;
  name: string;
  timestamp: number;
}

// posts

interface Post {
  _id: ObjectId;
  content: string;
  senderId: string;
  sender: BasicUserProfile;
  comments: PostComment[];
  commentsCount: number;
  likedUsers: TimestampId[];
  likedCount: number;
  timestamp: number;
  type: string;
}

interface PostComment {
  _id: ObjectId;
  content: string;
  postId: string;
  postSenderId: string;
  senderId: string;
  sender: BasicUserProfile;
  commentReplies: Reply[];
  commentRepliesCount: number;
  timestamp: number;
}

interface Reply {
  _id: ObjectId;
  content: string;
  senderId: string;
  sender: BasicUserProfile;
  postId: string;
  postSenderId: string;
  parentId: string;
  parentSenderId: string;
  replyReplies: Reply[];
  replyRepliesCount: number;
  timestamp: number;
}

// Notifications

interface Notifications {
  _id: ObjectId;
  userId: string;
  newNotifications: Array<NewNotification>;
  unread: number;
}

interface NewNotification {
  userId: string;
  postId?: string;
  replyId?: string;
  commentId?: string;
  timestamp: number;
  type: string;
}

interface NotificationData {
  _id: string;
  username: string;
  name: string;
  type: string;
  timestamp: number;
  postId: string | null;
  commentId: string | null;
  replyId: string | null;
}

interface NotificationDataObject {
  notifications: NotificationData[];
  unread: number;
}

export type {
  User,
  PublicUser,
  BasicUserProfile,
  FormData,
  Follower,
  Post,
  PostComment,
  Reply,
  TimestampId,
  Notifications,
  NewNotification,
  NotificationData,
  NotificationDataObject,
};
