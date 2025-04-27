"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/admin/Card";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Badge from "../../components/ui/admin/Badge";
import Avatar from "../../components/ui/admin/Avatar";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import { Search, Filter, Star, MessageSquare, Check, X } from "lucide-react";

interface Feedback {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  gigTitle?: string;
}

const feedbacks: Feedback[] = [
  {
    id: "F001",
    userName: "John Smith",
    userAvatar: "https://via.placeholder.com/150",
    date: "2 days ago",
    rating: 5,
    title: "Excellent service!",
    content:
      "The seller delivered the work ahead of schedule and exceeded my expectations. Would definitely recommend!",
    gigTitle: "Professional Logo Design",
  },
  {
    id: "F002",
    userName: "Sarah Johnson",
    userAvatar: "https://via.placeholder.com/150",
    date: "3 days ago",
    rating: 4,
    title: "Good work, minor revisions needed",
    content:
      "Overall good quality work, just needed a few minor adjustments. The seller was responsive and made the changes quickly.",
    gigTitle: "Website Development with React",
  },
  {
    id: "F003",
    userName: "Michael Brown",
    userAvatar: "https://via.placeholder.com/150",
    date: "1 week ago",
    rating: 3,
    title: "Average experience",
    content:
      "The work was delivered on time but didn't fully meet my requirements. The seller was willing to make changes but communication was slow.",
    gigTitle: "SEO Optimization Service",
  },
  {
    id: "F004",
    userName: "Emily Davis",
    userAvatar: "https://via.placeholder.com/150",
    date: "1 week ago",
    rating: 5,
    title: "Absolutely perfect!",
    content:
      "The content was well-written, engaging, and delivered ahead of schedule. I'll definitely be using this service again!",
    gigTitle: "Content Writing for Blogs",
  },
  {
    id: "F005",
    userName: "David Wilson",
    userAvatar: "https://via.placeholder.com/150",
    date: "2 weeks ago",
    rating: 2,
    title: "Disappointed with the results",
    content:
      "The work was not what I expected and the seller was not very responsive to my requests for revisions.",
    gigTitle: "Social Media Management",
  },
  {
    id: "F006",
    userName: "Jessica Taylor",
    userAvatar: "https://via.placeholder.com/150",
    date: "2 weeks ago",
    rating: 5,
    title: "Outstanding design work!",
    content:
      "The UI design was modern, clean, and exactly what I was looking for. The seller was a pleasure to work with.",
    gigTitle: "Mobile App UI Design",
  },
];

const UserFeedback: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.gigTitle &&
        feedback.gigTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getFeedbackVariant = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  return (  
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-2xl font-bold">User Feedback</h1>
        <p className="text-gray-500 mt-1">
          Manage and respond to feedback from users.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search feedback..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<Star className="h-4 w-4" />}
              >
                Rating
              </Button>
            }
            align="right"
          >
            <DropdownItem>5 Stars</DropdownItem>
            <DropdownItem>4 Stars</DropdownItem>
            <DropdownItem>3 Stars</DropdownItem>
            <DropdownItem>2 Stars</DropdownItem>
            <DropdownItem>1 Star</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={feedback.userAvatar}
                    alt={feedback.userName}
                    size="sm"
                    fallback={feedback.userName.substring(0, 2)}
                  />
                  <div>
                    <CardTitle className="text-sm">
                      {feedback.userName}
                    </CardTitle>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                </div>
                <Badge variant={getFeedbackVariant(feedback.rating)}>
                  <div className="flex items-center gap-1">
                    {renderStars(feedback.rating)}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">{feedback.title}</h3>
                <p className="text-sm text-gray-500">{feedback.content}</p>
                {feedback.gigTitle && (
                  <div className="flex items-center gap-2 rounded-md bg-gray-50 p-2 text-xs">
                    <span className="font-medium">Gig:</span>{" "}
                    {feedback.gigTitle}
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  Reply
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600"
                    icon={<Check className="h-4 w-4" />}
                  >
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    icon={<X className="h-4 w-4" />}
                  >
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserFeedback;
