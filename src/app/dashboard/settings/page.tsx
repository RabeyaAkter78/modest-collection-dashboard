"use client";

import { useState } from "react";
import { mockCMSContent } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import { FileText, Shield, Phone, Save } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { CMSContent } from "@/types";

const tabs: { key: CMSContent["type"]; label: string; icon: React.ReactNode }[] = [
  { key: "privacy_policy", label: "Privacy Policy", icon: <Shield size={16} /> },
  { key: "terms_conditions", label: "Terms & Conditions", icon: <FileText size={16} /> },
  { key: "contact_info", label: "Contact Info", icon: <Phone size={16} /> },
];

export default function SettingsPage() {
  const [contents, setContents] = useState<CMSContent[]>(mockCMSContent);
  const [activeTab, setActiveTab] = useState<CMSContent["type"]>("privacy_policy");
  const { addToast } = useToast();

  const currentContent = contents.find((c) => c.type === activeTab);

  const handleContentChange = (value: string) => {
    setContents((prev) =>
      prev.map((c) =>
        c.type === activeTab ? { ...c, content: value, updatedAt: new Date().toISOString().split("T")[0] } : c
      )
    );
  };

  const handleTitleChange = (value: string) => {
    setContents((prev) =>
      prev.map((c) =>
        c.type === activeTab ? { ...c, title: value } : c
      )
    );
  };

  const handleSave = () => {
    addToast("Content saved successfully", "success");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS / Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage website content and settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Editor */}
      {currentContent && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{currentContent.title}</h3>
                <p className="text-xs text-slate-400">Last updated: {formatDate(currentContent.updatedAt)}</p>
              </div>
            </div>

            <Input
              id="cms-title"
              label="Title"
              value={currentContent.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <Textarea
              id="cms-content"
              label="Content"
              value={currentContent.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[300px]"
            />

            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Additional Settings */}
      <Card>
        <h3 className="mb-4 text-base font-semibold text-slate-900">General Settings</h3>
        <div className="space-y-4">
          <Input
            id="site-name"
            label="Site Name"
            defaultValue="Modest Collection"
          />
          <Input
            id="site-email"
            label="Support Email"
            defaultValue="support@modestcollection.com"
          />
          <Input
            id="currency"
            label="Currency"
            defaultValue="BDT (৳)"
          />
          <div className="flex justify-end">
            <Button onClick={() => addToast("Settings saved successfully", "success")}>
              <Save size={16} />
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
