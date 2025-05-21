import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileInfo from "../components/Profile/ProfileInfo";
import ProfileTabs from "../components/Profile/ProfileTabs";
import useUserRole from "../hooks/useUserRole";
import { useNotification } from "../contexts/NotificationContext";

// Định nghĩa interface cho dữ liệu người dùng
interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
  role: string;
  description?: string;
  hardSkill?: string;
  softSkill?: string;
  languages?: string;
  education?: string;
  certificates?: string;
  createdAt: string;
  updatedAt: string;
  gigs?: GigData[];
  freelancerProfile?: {
    _id?: string;
    hardSkill?: string;
    softSkill?: string;
    languages?: string;
    education?: string;
    certificates?: string;
    description?: string;
    fullName?: string;
    industry?: string;
    country?: string;
  };
  isViewingOtherUser?: boolean; // Thêm flag để xác định nếu đang xem người dùng khác
}

// Định nghĩa interface cho dữ liệu gig
interface GigData {
  _id: string;
  title: string;
  description: string;
  price: number | { toString: () => string } | any;
  media: Array<{
    url: string;
    type: string;
    thumbnailUrl?: string;
  }>;
  freelancer?: {
    _id: string;
    name: string;
    avatar: string;
    level: number;
  };
  freelancerId?: string;
  status?: 'approved' | 'pending' | 'hidden';
  [key: string]: any;
}

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const {
    isCustomer,
    isFreelancer,
    isAdmin,
    isLoading: roleLoading,
  } = useUserRole();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { userId } = useParams<{ userId?: string }>();
  const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    if (!clerkUser && !userId) return;

    try {
      setLoading(true);

      // Nếu có userId trong URL, lấy thông tin của người dùng đó (Admin xem người bán)
      if (userId) {
        setIsViewingOtherUser(true);

        try {
          // Thử sử dụng API profile mới để lấy thông tin đầy đủ của người dùng
          const profileResponse = await axios.get(
            `http://localhost:5000/api/profile/user/${userId}`,
            {
              withCredentials: true,
            }
          );

          if (
            profileResponse.data &&
            !profileResponse.data.error &&
            profileResponse.data.data
          ) {
            // Lấy thêm thông tin về gigs của freelancer (nếu là freelancer)
            let gigsData = [];

            // Nếu người dùng là freelancer, thử lấy dữ liệu gig từ endpoint khác
            if (profileResponse.data.data.role === "freelancer") {
              try {
                // Sử dụng API endpoint gigs chính xác, không phải /api/site/gigs
                const allGigsResponse = await axios.get(
                  `http://localhost:5000/api/gigs`,
                  {
                    withCredentials: true,
                  }
                );

                if (allGigsResponse.data && !allGigsResponse.data.error) {
                  console.log("Tất cả gigs:", allGigsResponse.data);
                  // Thêm debug để kiểm tra các ID đang được so sánh
                  console.log("Đang tìm gigs cho userId:", userId);

                  // Lọc các gig của người dùng cụ thể, kiểm tra nhiều trường hợp khác nhau
                  gigsData =
                    allGigsResponse.data.gigs.filter((gig) => {
                      // Hiển thị thông tin freelancerId để debug
                      console.log(
                        `Gig ${gig._id} có freelancerId:`,
                        gig.freelancerId
                      );

                      if (gig.freelancerId === userId) return true;
                      if (gig.freelancer && gig.freelancer._id === userId)
                        return true;
                      if (gig.freelancer && gig.freelancer === userId)
                        return true;
                      if (gig.user && gig.user._id === userId) return true;
                      if (gig.user && gig.user.clerkId === userId) return true;

                      // Kiểm tra nếu user có trường clerkId trùng với userId
                      return false;
                    }) || [];

                  // Thêm thông tin freelancer vào mỗi gig nếu chưa có
                  gigsData = gigsData.map((gig: GigData) => {
                    // Nếu đã có thông tin freelancer đầy đủ thì giữ nguyên
                    if (gig.freelancer && gig.freelancer.avatar && gig.freelancer.name) {
                      return gig;
                    }
                    
                    // Nếu chưa có thông tin freelancer, thêm vào từ dữ liệu người dùng
                    return {
                      ...gig,
                      freelancer: {
                        _id: userId,
                        name: profileResponse.data.data.name || "Freelancer",
                        avatar: profileResponse.data.data.avatar || "/placeholder-avatar.png",
                        level: 1
                      },
                      // Đảm bảo giá luôn có định dạng đúng
                      price: gig.price || 0
                    };
                  });

                  console.log("Gigs của người dùng sau khi xử lý:", gigsData);
                }
              } catch (error) {
                console.log("Không thể lấy dữ liệu gig từ API gigs", error);
              }
            }

            // Sử dụng dữ liệu từ API profile mới
            const userData = profileResponse.data.data;

            setUserData({
              ...userData,
              gigs: gigsData,
              isViewingOtherUser: true,
            });
            return;
          }
        } catch (error) {
          // Nếu API mới thất bại, sử dụng API cũ
          console.log("Không thể sử dụng API profile mới, chuyển sang API cũ");
        }

        // Sử dụng API endpoint thông thường để lấy thông tin người dùng
        const userResponse = await axios.get(
          `http://localhost:5000/api/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (userResponse.data && !userResponse.data.error) {
          // Lấy thêm thông tin về gigs của freelancer (sử dụng phương pháp thay thế)
          let gigsData = [];

          if (userResponse.data.data.role === "freelancer") {
            try {
              // Sử dụng API endpoint gigs chính xác
              const allGigsResponse = await axios.get(
                `http://localhost:5000/api/gigs`,
                {
                  withCredentials: true,
                }
              );

              if (allGigsResponse.data && !allGigsResponse.data.error) {
                console.log("Tất cả gigs:", allGigsResponse.data);
                console.log("Đang tìm gigs cho userId:", userId);

                // Lọc các gig của người dùng cụ thể, áp dụng các điều kiện lọc giống như trên
                gigsData =
                  allGigsResponse.data.gigs.filter((gig) => {
                    console.log(
                      `Gig ${gig._id} có freelancerId:`,
                      gig.freelancerId
                    );

                    if (gig.freelancerId === userId) return true;
                    if (gig.freelancer && gig.freelancer._id === userId)
                      return true;
                    if (gig.freelancer && gig.freelancer === userId)
                      return true;
                    if (gig.user && gig.user._id === userId) return true;
                    if (gig.user && gig.user.clerkId === userId) return true;

                    return false;
                  }) || [];

                // Thêm thông tin freelancer vào mỗi gig nếu chưa có
                gigsData = gigsData.map((gig: GigData) => {
                  // Nếu đã có thông tin freelancer đầy đủ thì giữ nguyên
                  if (gig.freelancer && gig.freelancer.avatar && gig.freelancer.name) {
                    return gig;
                  }
                  
                  // Nếu chưa có thông tin freelancer, thêm vào từ dữ liệu người dùng
                  return {
                    ...gig,
                    freelancer: {
                      _id: userId,
                      name: userResponse.data.data.name || "Freelancer",
                      avatar: userResponse.data.data.avatar || "/placeholder-avatar.png",
                      level: 1
                    },
                    // Đảm bảo giá luôn có định dạng đúng
                    price: gig.price || 0
                  };
                });

                console.log("Gigs của người dùng sau khi xử lý:", gigsData);
              }
            } catch (error) {
              console.log(
                "Không thể lấy dữ liệu gig của người dùng này",
                error
              );
            }
          }

          // Xử lý để tạo đối tượng userData với thông tin profile
          // Nếu người dùng là freelancer, chúng ta sẽ sử dụng thông tin profile từ userResponse
          const userData = userResponse.data.data || userResponse.data;

          if (userData.role === "freelancer") {
            // Đối với freelancer, tạo một đối tượng freelancerProfile từ các trường có sẵn
            const freelancerProfile = {
              description: userData.description || "",
              hardSkill: userData.hardSkill || "",
              softSkill: userData.softSkill || "",
              languages: userData.languages || "",
              education: userData.education || "",
              certificates: userData.certificates || "",
              fullName: userData.name || "",
              country: userData.country || "",
            };

            setUserData({
              ...userData,
              gigs: gigsData,
              freelancerProfile: freelancerProfile,
              isViewingOtherUser: true,
            });
          } else {
            // Nếu không phải freelancer, chỉ cần cập nhật userData cơ bản
            setUserData({
              ...userData,
              gigs: gigsData,
              isViewingOtherUser: true,
            });
          }
        }
      } else {
        // ... phần code hiện có cho người dùng xem profile của chính mình ...
        // Lấy thông tin người dùng hiện tại (cách hiện tại)
        const response = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });

        if (response.data && response.data.user) {
          // Nếu là freelancer, lấy thêm thông tin chi tiết về gigs và profile
          if (response.data.user.role === "freelancer") {
            // Fetch gigs
            const gigsResponse = await axios.get(
              "http://localhost:5000/api/gigs/get-list",
              {
                withCredentials: true,
              }
            );

            // Thêm thông tin freelancer vào mỗi gig nếu chưa có
            let processedGigs: GigData[] = [];
            if (gigsResponse.data?.gigs && gigsResponse.data.gigs.length > 0) {
              processedGigs = gigsResponse.data.gigs.map((gig: GigData) => {
                // Nếu gig đã có thông tin freelancer đầy đủ thì giữ nguyên
                if (gig.freelancer && gig.freelancer.avatar && gig.freelancer.name) {
                  return gig;
                }
                
                // Nếu không có, thêm thông tin từ user hiện tại
                return {
                  ...gig,
                  freelancer: {
                    _id: response.data.user._id,
                    name: response.data.user.name || "Freelancer",
                    avatar: response.data.user.avatar || "/placeholder-avatar.png",
                    level: 1
                  },
                  // Đảm bảo giá luôn có định dạng đúng
                  price: gig.price || 0
                };
              });
            }

            // Fetch freelancer profile details
            const token = await getToken();
            const profileResponse = await axios.get(
              "http://localhost:5000/api/profile/get",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (profileResponse.data && !profileResponse.data.error) {
              setUserData({
                ...response.data.user,
                gigs: processedGigs,
                freelancerProfile: profileResponse.data.data || {},
                isViewingOtherUser: false,
              });
            } else {
              setUserData({
                ...response.data.user,
                gigs: processedGigs,
                isViewingOtherUser: false,
              });
            }
          } else {
            // Nếu là customer, chỉ lấy thông tin cơ bản
            setUserData({
              ...response.data.user,
              isViewingOtherUser: false,
            });
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      showNotification(
        "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load profile data on first render
  useEffect(() => {
    fetchUserProfile();
  }, [clerkUser, userId]);

  // Hàm cập nhật thông tin người dùng
  const handleUpdateUser = async (userData: Partial<UserData>) => {
    try {
      // Đảm bảo có trường fullName theo yêu cầu của validator backend
      const response = await axios.put(
        "http://localhost:5000/api/profile/update",
        {
          description: userData.description,
          hardSkill: userData.hardSkill,
          softSkill: userData.softSkill,
          languages: userData.languages,
          education: userData.education,
          certificates: userData.certificates,
          fullName:
            userData.fullName ||
            userData.name ||
            clerkUser?.firstName + " " + clerkUser?.lastName ||
            "User Name",
        },
        { withCredentials: true }
      );

      if (response.data && !response.data.error) {
        showNotification("Cập nhật thông tin thành công!", "success");
        // Cập nhật lại thông tin sau khi sửa đổi
        fetchUserProfile();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      // Hiển thị thông tin lỗi chi tiết hơn để debug
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
      showNotification("Có lỗi xảy ra khi cập nhật thông tin!", "error");
    }
  };

  if (loading || (roleLoading && !userId) || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Bao gồm cả avatar và thông tin người dùng */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header - Đã được đưa xuống đây */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col items-center text-center mb-4">
                {/* Avatar */}
                <div className="w-24 h-24 mb-4">
                  <img
                    src={
                      userData.avatar || clerkUser?.imageUrl || "/avatar.jpg"
                    }
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                  />
                </div>

                {/* Tên và thông tin cơ bản */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name ? userData.name.replace(/\s*null\s*/, "") : ""}
                </h1>

                {/* Badge cho vai trò */}
                {userData.role === "customer" && (
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Khách hàng
                  </div>
                )}
                {userData.role === "freelancer" && (
                  <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Freelancer
                  </div>
                )}

                {/* Badge cho Admin xem */}
                {userData.isViewingOtherUser && isAdmin && (
                  <div className="mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Xem bởi Admin
                  </div>
                )}

                {/* Thông tin bổ sung - Đã sắp xếp lại thứ tự */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Tham gia{" "}
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )
                        : "Không có thông tin"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần thông tin profile */}
            <ProfileInfo
              user={{
                description:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.description ||
                      userData.description ||
                      ""
                    : userData.description || "",
                hardSkill:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.hardSkill ||
                      userData.hardSkill ||
                      ""
                    : "",
                softSkill:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.softSkill ||
                      userData.softSkill ||
                      ""
                    : "",
                languages:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.languages ||
                      userData.languages ||
                      ""
                    : "",
                education:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.education ||
                      userData.education ||
                      ""
                    : "",
                certificates:
                  userData.role === "freelancer"
                    ? userData.freelancerProfile?.certificates ||
                      userData.certificates ||
                      ""
                    : "",
              }}
              isCustomer={userData.role === "customer"}
              onUpdateUser={
                !userData.isViewingOtherUser ? handleUpdateUser : undefined
              }
              fetchUserProfile={
                !userData.isViewingOtherUser ? fetchUserProfile : undefined
              }
              isViewMode={userData.isViewingOtherUser || false}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Chỉ hiển thị tabs nếu là freelancer */}
            {userData.role === "freelancer" && (
              <ProfileTabs gigs={userData.gigs || []} isFreelancer={true} />
            )}

            {/* Hiển thị nội dung cho customer */}
            {userData.role === "customer" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Thông tin người dùng
                </h2>
                <p className="text-gray-600">
                  {userData.isViewingOtherUser
                    ? `Đây là trang cá nhân của ${userData.name}. Người dùng này đang là khách hàng trong hệ thống.`
                    : "Chào mừng bạn đến với trang cá nhân của mình. Từ đây bạn có thể xem và cập nhật thông tin cá nhân cơ bản."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
