export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  balance: number;
  image: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  duration: number | null;
  category: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  files: File[];
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  videoId: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  stripePaymentId: string | null;
  type: "ONE_TIME" | "SUBSCRIPTION" | "TOP_UP";
  metadata: any;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: "BANK_TRANSFER" | "VODAFONE_CASH" | "INSTAPAY";
  accountInfo: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  processedAt: Date | null;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  videoId: string;
  price: number;
  createdAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  videoId: string;
  progress: number;
  completed: boolean;
  updatedAt: Date;
}