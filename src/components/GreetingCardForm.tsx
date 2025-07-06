"use client";

import React from "react";
import { Form, Input, Button, Typography } from "antd";
import GlassCard from "./GlassCard";
import "@ant-design/v5-patch-for-react-19";

const { TextArea } = Input;
const { Title } = Typography;

export interface GreetingCardFormData {
  dear: string;
  message: string;
  from: string;
}

interface GreetingCardFormProps {
  onSubmit?: (values: GreetingCardFormData) => void;
  loading?: boolean;
  className?: string;
  dear: string;
  message: string;
  from: string;
  onChange: (field: string, value: string) => void;
  onDownloadCard?: () => void;
  disabledDownload?: boolean;
}

const GreetingCardForm: React.FC<GreetingCardFormProps> = ({
  onSubmit,
  loading = false,
  className = "",
  dear,
  message,
  from,
  onChange,
  onDownloadCard,
  disabledDownload = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({ dear, message, from });
  }, [dear, message, from, form]);

  const handleSubmit = async (values: GreetingCardFormData) => {
    try {
      await onSubmit?.(values);
      form.resetFields();
    } catch {
      console.log("error");
    }
  };

  return (
    <GlassCard className={`max-w-2xl mx-auto ${className}`}>
      <div className="text-center">
        <Title level={3} color="gray-200" className="!mb-0">
          <span className="text-gray-200">Greeting Card</span>
        </Title>
        <p className="text-gray-400">Fill in the details below</p>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          label="Dear"
          name="dear"
          className="text-gray-200"
          rules={[
            {
              max: 20,
              message: "Recipient name cannot exceed 20 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter recipient name"
            showCount
            maxLength={20}
            value={dear}
            onChange={(e) => onChange("dear", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Message" name="message" className="text-gray-200">
          <TextArea
            placeholder="Write your heartfelt message here..."
            rows={2}
            maxLength={100}
            className="resize-none"
            value={message}
            onChange={(e) => onChange("message", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="From"
          name="from"
          className="text-gray-200"
          rules={[
            {
              max: 20,
              message: "Your name cannot exceed 20 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter your name"
            showCount
            maxLength={20}
            value={from}
            onChange={(e) => onChange("from", e.target.value)}
          />
        </Form.Item>

        <Form.Item className="!mb-0">
          <div className="flex justify-center">
            <Button
              variant="solid"
              color="red"
              htmlType="button"
              loading={loading}
              size="large"
              className="min-w-32 h-12 text-base"
              onClick={onDownloadCard}
              disabled={disabledDownload}
            >
              {loading ? "Download..." : "Download Card"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </GlassCard>
  );
};

export default GreetingCardForm;
