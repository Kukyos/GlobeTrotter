import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale, AlertTriangle } from 'lucide-react';

/**
 * Terms of Service Page
 * Comprehensive legal terms for GlobeTrotter
 */
const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Scale className="w-7 h-7 text-white/70" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-white">Terms of Service</h1>
            <p className="text-white/50">Last updated: January 2026</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Introduction */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-white/50" />
            1. Introduction
          </h2>
          <div className="text-white/70 space-y-4">
            <p>
              Welcome to GlobeTrotter ("we," "our," or "us"). By accessing or using our travel planning 
              platform and services, you agree to be bound by these Terms of Service ("Terms").
            </p>
            <p>
              GlobeTrotter provides a platform for planning, organizing, and managing travel itineraries. 
              Our services include trip planning tools, destination information, AI-powered travel 
              recommendations, and collaborative features.
            </p>
          </div>
        </section>

        {/* User Accounts */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/50" />
            2. User Accounts
          </h2>
          <div className="text-white/70 space-y-4">
            <p>To use certain features of our service, you must create an account. You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              You must be at least 13 years old to create an account. If you are under 18, you must have 
              parental or guardian consent to use our services.
            </p>
          </div>
        </section>

        {/* Use of Services */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">3. Acceptable Use</h2>
          <div className="text-white/70 space-y-4">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service for any unlawful purpose or in violation of any laws</li>
              <li>Share, sell, or transfer your account to any third party</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Use automated systems or software to extract data from our service</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Infringe on intellectual property rights of others</li>
            </ul>
          </div>
        </section>

        {/* Content & Data */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">4. User Content</h2>
          <div className="text-white/70 space-y-4">
            <p>
              You retain ownership of content you create on GlobeTrotter, including trips, itineraries, 
              and reviews. By posting content, you grant us a non-exclusive, worldwide, royalty-free 
              license to use, display, and distribute your content in connection with our services.
            </p>
            <p>
              We reserve the right to remove any content that violates these Terms or is otherwise 
              objectionable at our sole discretion.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">5. Privacy & Data</h2>
          <div className="text-white/70 space-y-4">
            <p>
              Your privacy is important to us. Our collection and use of personal information is 
              governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p>
              By using our services, you consent to the collection, use, and sharing of your 
              information as described in our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">6. Third-Party Services</h2>
          <div className="text-white/70 space-y-4">
            <p>
              GlobeTrotter may integrate with or link to third-party services, including but not 
              limited to Google Maps, payment processors, and travel booking platforms.
            </p>
            <p>
              We are not responsible for the content, policies, or practices of third-party services. 
              Your use of such services is governed by their respective terms and policies.
            </p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="card p-8 border-yellow-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            7. Disclaimers
          </h2>
          <div className="text-white/70 space-y-4">
            <p className="font-medium text-yellow-500/80">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
            </p>
            <p>
              We do not guarantee the accuracy, completeness, or reliability of any information 
              provided through our service, including travel recommendations, pricing, and availability.
            </p>
            <p>
              Travel involves inherent risks. You are solely responsible for researching and verifying 
              travel requirements, safety conditions, and booking arrangements for your trips.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">8. Limitation of Liability</h2>
          <div className="text-white/70 space-y-4">
            <p>
              To the maximum extent permitted by law, GlobeTrotter and its affiliates shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, 
              including loss of profits, data, or other intangible losses.
            </p>
            <p>
              Our total liability for any claim arising from these Terms or your use of the service 
              shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">9. Changes to Terms</h2>
          <div className="text-white/70 space-y-4">
            <p>
              We may modify these Terms at any time. We will notify users of material changes through 
              the service or via email. Your continued use of the service after changes become effective 
              constitutes acceptance of the updated Terms.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="card p-8">
          <h2 className="text-xl font-bold text-white mb-4">10. Termination</h2>
          <div className="text-white/70 space-y-4">
            <p>
              You may terminate your account at any time by contacting us or using the account deletion 
              feature in your profile settings.
            </p>
            <p>
              We reserve the right to suspend or terminate your account for violations of these Terms, 
              suspected fraudulent activity, or any other reason at our sole discretion.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="card p-8 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">11. Contact Us</h2>
          <div className="text-white/70 space-y-4">
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="font-medium text-white">GlobeTrotter Support</p>
              <p>Email: legal@globetrotter.app</p>
              <p>Address: 123 Travel Street, Adventure City, AC 12345</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
        <p>© 2026 GlobeTrotter. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
