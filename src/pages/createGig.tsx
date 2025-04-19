import CreateGigForm from "../components/Gig/create-gig-form";

export default function CreateGigPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
            Tạo Dịch Vụ Mới
          </h1>
          <p className="mt-3 text-lg text-gray-700">
            Hãy điền đầy đủ thông tin để dịch vụ của bạn nổi bật và chuyên nghiệp hơn.
          </p>
        </header>

        {/* Form Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Thông Tin Dịch Vụ
          </h2>
          <CreateGigForm />
        </section>
      </div>
    </div>
  );
}
