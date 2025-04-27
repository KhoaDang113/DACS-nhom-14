import React, { useState } from 'react';
import { Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

interface ComplaintFormProps {
  orderId: string;
  onClose: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ orderId, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Gọi API gửi khiếu nại
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('title', title);
      formData.append('description', description);
      files.forEach(file => formData.append('files', file));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Lỗi khi gửi khiếu nại:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gửi Khiếu Nại</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Tiêu đề khiếu nại"
            placeholder="Nhập tiêu đề khiếu nại"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
        </div>
        
        <div>
          <Textarea
            label="Mô tả chi tiết"
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            minRows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đính kèm bằng chứng (tùy chọn)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button color="default" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            color="primary" 
            type="submit"
            isLoading={isSubmitting}
          >
            Gửi Khiếu Nại
          </Button>
        </div>
      </form>

      <Modal isOpen={showSuccessModal} onClose={() => {
        setShowSuccessModal(false);
        onClose();
      }}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium">Thông báo</h3>
          </ModalHeader>
          <ModalBody>
            <p>Khiếu nại của bạn đã được ghi nhận và đang được xử lý.</p>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
            >
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ComplaintForm; 