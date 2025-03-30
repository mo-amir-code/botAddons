import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          ChatGPT Manager - Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          <strong>Last Updated:</strong> March 28, 2025
        </p>
        <p className="mb-6">
          Welcome to ChatGPT Manager! We are committed to protecting your
          privacy while enhancing your ChatGPT experience. This Privacy Policy
          explains how we collect, use, store, and safeguard your information
          when you use our Chrome extension, ChatGPT Manager, on ChatGPT.com.
        </p>

        {/* Section 1: Information We Collect */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          1. Information We Collect
        </h2>
        <p className="mb-3">
          We collect the following data to provide ChatGPT Manager’s features:
        </p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>Personal Information:</strong> Your email, name, and user
            ID, which you provide during setup or login.
          </li>
          <li>
            <strong>Authentication Token:</strong> A token to manage your login
            status.
          </li>
          <li>
            <strong>Custom Prompts:</strong> Prompts you create and save for
            quick access.
          </li>
          <li>
            <strong>Chat IDs and Folders:</strong> Identifiers for your ChatGPT
            conversations and the folders you create to organize them.
          </li>
          <li>
            <strong>Web Activity on ChatGPT.com:</strong> We detect URL changes
            on ChatGPT.com to trigger features like the Quick Access Prompt
            list.
          </li>
        </ul>

        {/* Section 2: Information We Do Not Collect */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          2. Information We Do Not Collect
        </h2>
        <p className="mb-3">We do not collect:</p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            Personal communications, such as your ChatGPT conversations or
            messages.
          </li>
          <li>Financial, health, or location data.</li>
          <li>Web history or activity outside of ChatGPT.com.</li>
        </ul>

        {/* Section 3: How We Use Your Information */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          3. How We Use Your Information
        </h2>
        <p className="mb-3">We use the collected data to:</p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            Enable features like Deep Search, folder management, and quick
            prompt access on ChatGPT.com.
          </li>
          <li>
            Store your prompts, chat IDs, and folders to provide a seamless
            experience across devices.
          </li>
          <li>
            Detect page changes on ChatGPT.com to ensure our features work in
            real-time.
          </li>
          <li>
            Authenticate your login status for secure access to your settings.
          </li>
        </ul>

        {/* Section 4: Data Storage */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          4. Data Storage
        </h2>
        <p className="mb-3">
          We store your data in two ways to balance speed and functionality:
        </p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>Local Storage:</strong> Your authentication token, email,
            name, user ID, and custom prompts are stored locally on your device
            using Chrome’s secure storage API (
            <code className="bg-gray-200 px-1 rounded">
              chrome.storage.local
            </code>
            ). This allows quick access to features like Quick Access Prompt
            without needing an internet connection.
          </li>
          <li>
            <strong>Backend Storage:</strong> Your email, name, prompts, chat
            IDs, and folders are stored on our secure backend server at{" "}
            <code className="bg-gray-200 px-1 rounded">api.botaddons.com</code>.
            This enables cross-device syncing and ensures you can access your
            organized chats and prompts from anywhere.
          </li>
        </ul>

        {/* Section 5: Data Security */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          5. Data Security
        </h2>
        <p className="mb-6">
          We take your privacy seriously. Data stored locally remains on your
          device and is protected by Chrome’s security measures. Data sent to
          our backend at{" "}
          <code className="bg-gray-200 px-1 rounded">api.botaddons.com</code> is
          transmitted over HTTPS to ensure encryption during transfer. On our
          servers, your data is stored securely with industry-standard
          encryption and access controls to prevent unauthorized access.
        </p>

        {/* Section 6: Third-Party Sharing */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          6. Third-Party Sharing
        </h2>
        <p className="mb-6">
          We do not share your data with third parties, except as necessary to
          provide our services (e.g., hosting on our secure backend at{" "}
          <code className="bg-gray-200 px-1 rounded">api.botaddons.com</code>).
          Your data is never sold, traded, or used for advertising purposes.
        </p>

        {/* Section 7: Data Retention and Deletion */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          7. Data Retention and Deletion
        </h2>
        <p className="mb-6">
          Data stored locally persists until you uninstall the extension, at
          which point it is automatically removed by Chrome. Data on our backend
          is retained as long as you use ChatGPT Manager. If you wish to delete
          your data, you can contact us (see Section 9), and we will remove your
          information from our servers within 30 days.
        </p>

        {/* Section 8: Permissions and Why We Need Them */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          8. Permissions and Why We Need Them
        </h2>
        <p className="mb-3">
          ChatGPT Manager requires the following permissions:
        </p>
        <ul className="list-disc pl-5 mb-6">
          <li>
            <strong>tabs:</strong> To detect URL changes on ChatGPT.com and
            update features like the prompt list.
          </li>
          <li>
            <strong>storage:</strong> To save your prompts, login status, and
            user info locally.
          </li>
          <li>
            <strong>activeTab:</strong> To interact with your current tab on
            ChatGPT.com, like opening the popup.
          </li>
          <li>
            <strong>chatgpt.com host:</strong> To limit our access to
            ChatGPT.com, keeping your experience focused and secure.
          </li>
        </ul>

        {/* Section 9: Changes to This Privacy Policy */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          9. Changes to This Privacy Policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy to reflect changes in our extension
          or legal requirements. The latest version will always be available
          here, with the “Last Updated” date at the top.
        </p>

        {/* Section 10: Contact Us */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          10. Contact Us
        </h2>
        <p className="mb-6">
          If you have questions about this Privacy Policy, how we handle your
          data, or to request data deletion, please reach out to us at{" "}
          <a
            href="mailto:aamir.business.hub@gmail.com"
            className="text-blue-600 hover:underline"
          >
            aamir.business.hub@gmail.com
          </a>
          .
        </p>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Thank you for choosing ChatGPT Manager! We’re here to make your
            ChatGPT experience better, safer, and more organized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
