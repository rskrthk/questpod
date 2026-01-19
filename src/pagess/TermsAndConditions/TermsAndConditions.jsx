import Layout from "@/components/Layout/Layout";
import React from "react";

export default function TermsAndConditions() {
  const currentYear = new Date().getFullYear();
  const lastUpdatedDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <div className="min-h-screen  py-10 px-4 md:px-12 lg:px-24 flex justify-center">
        <div className=" p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl  w-full max-w-screen-xl">
          {/* Header */}
          <header className="text-center border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Terms and Conditions
            </h1>

            <p className="text-sm text-gray-600">
              Website:{" "}
              <a
                href="https://www.questpodai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                www.questpodai.com
              </a>
            </p>

            <p className="text-sm text-gray-600">Last Updated: 29-07-2025</p>
          </header>

          {/* Main Sections - adjusted spacing and typography */}
          <div className="space-y-10 text-gray-800 leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing or using{" "}
                <a
                  href="https://www.questpodai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  www.questpodai.com
                </a>{" "}
                (the "Website") and our AI-powered services (collectively, the
                "Service"), operated by QuestpodAI, a partnership registered
                in Bangalore, Karnataka, India, you agree to be bound by these{" "}
                <strong className="text-gray-900">Terms and Conditions</strong>{" "}
                ("Terms"). If you do not agree to these Terms, do not use the
                Service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                2. Description of Service
              </h2>
              <p className="mb-4">
               QuestpodAI provides an artificial intelligence-powered
                platform through our website{" "}
                <a
                  href="https://www.questpodai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.questpodai.com
                </a>{" "}
                that enables users to access AI tools, create and upload
                content, and purchase products and services.
              </p>
              <p>
                The Service is provided on a subscription basis and includes
                various AI-powered features, tools, and capabilities.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                3. Account Registration and Security
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                3.1 Account Creation
              </h3>
              <p className="mb-4">
                You must create an account to use certain features of the
                Service. You agree to provide accurate, current, and complete
                information during registration and to update such information
                as necessary.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                3.2 Account Security
              </h3>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must immediately notify us of any unauthorized use
                of your account.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                3.3 Eligibility
              </h3>
              <p className="mb-4">
                You must be at least 18 years old or the age of majority in your
                jurisdiction to create an account and use the Service. By using
                the Service, you represent that you meet these age requirements.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                4. User Content and Uploads
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                4.1 Your Content Rights
              </h3>
              <p className="mb-4">
                You retain ownership of any content you create, upload, or
                submit to the Service ("User Content"), including text, images,
                and other materials.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                4.2 License to Us
              </h3>
              <p className="mb-4">
                By uploading User Content, you grant QuestpodAI a worldwide,
                non-exclusive, royalty-free license to use, reproduce, modify,
                adapt, publish, translate, distribute, and display your User
                Content solely for the purpose of providing and improving the
                Service.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                4.3 Content Responsibility
              </h3>
              <p className="mb-2">
                You are solely responsible for your User Content and warrant
                that:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>You own or have the necessary rights to the content</li>
                <li>Your content does not violate any third-party rights</li>
                <li>
                  Your content complies with applicable laws and these Terms
                </li>
              </ul>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                4.4 Content Removal
              </h3>
              <p className="mb-4">
                We reserve the right to remove any User Content that violates
                these Terms or is otherwise objectionable, in our sole
                discretion.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                5. Products and Purchases
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                5.1 Product Availability
              </h3>
              <p className="mb-4">
                We offer various digital products and services for purchase
                through the Website. Product availability, features, and pricing
                are subject to change without notice.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                5.2 Payment Terms
              </h3>
              <p className="mb-4">
                All purchases are subject to acceptance and availability. Prices
                are displayed in Indian Rupees (INR) unless otherwise specified.
                Payment is required at the time of purchase using accepted
                payment methods.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                5.3 Refund Policy
              </h3>
              <p className="mb-4">
                All sales are final unless otherwise specified for particular
                products or required by applicable law. We may, at our
                discretion, offer refunds or credits on a case-by-case basis.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                6. Subscription Plans
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                6.1 Subscription Services
              </h3>
              <p className="mb-4">
                We offer various subscription plans with different features,
                usage limits, and pricing. Current plans and pricing are
                available on our website.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                6.2 Billing and Payment
              </h3>
              <p className="mb-4">
                Subscription fees are billed in advance on the billing cycle
                specified in your chosen plan (monthly, annually, etc.). All
                subscription fees are non‑refundable except as expressly stated
                or required by applicable law.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                6.3 Auto‑Renewal
              </h3>
              <p className="mb-4">
                Subscriptions automatically renew for successive periods of the
                same duration unless cancelled before the renewal date. You may
                cancel your subscription at any time through your account
                settings.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                6.4 Price Changes
              </h3>
              <p className="mb-4">
                We may modify subscription pricing with 30 days' notice to
                active subscribers. Price changes will not affect your current
                billing cycle but will apply to subsequent renewal periods.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                7. Intellectual Property Rights
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                7.1 Our Property
              </h3>
              <p className="mb-4">
                The Service, Website, and all content, features, functionality,
                information, software, AI models, algorithms, text, graphics,
                logos, button icons, images, audio clips, data compilations, and
                other materials contained therein (“QuestpodAI Content”) are
                owned by QuestpodAI and are protected by Indian and
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                7.2 Our Trademarks
              </h3>
              <p className="mb-4">
                “QuestpodAI,” the QuestpodAI logo, and all related names,
                logos, product and service names, designs, and slogans are
                trademarks of QuestpodAI. You may not use our trademarks
                without our prior written consent.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                7.3 AI‑Generated Content
              </h3>
              <p className="mb-2">
                Content generated by our AI models based on your inputs
                (“Generated Content”) is provided for your use, but you
                acknowledge that:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Generated Content may not be unique to you</li>
                <li>
                  We make no warranties about the accuracy, originality, or
                  suitability of Generated Content
                </li>
                <li>
                  You are responsible for ensuring Generated Content complies
                  with applicable laws and does not infringe third‑party rights
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                8. Feedback and Suggestions
              </h2>
              <p className="mb-2">
                By providing feedback, suggestions, ideas, or other input
                regarding the Service (“Feedback”), you agree that:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>
                  QuestpodAI may use, modify, and incorporate such Feedback
                  without any obligation to compensate you
                </li>
                <li>You waive any rights you may have in such Feedback</li>
                <li>
                  QuestpodAI is not obligated to implement or consider any
                  Feedback
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                9. Acceptable Use Policy
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                9.1 Permitted Use
              </h3>
              <p className="mb-2">
                You may use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights of others</li>
                <li>
                  Upload or transmit harmful, threatening, abusive, defamatory,
                  or illegal content
                </li>
                <li>
                  Use the Service to generate content that promotes violence,
                  hatred, or discrimination
                </li>
                <li>
                  Attempt to reverse engineer, hack, or compromise the Service
                </li>
                <li>
                  Use automated tools to access the Service beyond normal usage
                  patterns
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
              </ul>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                9.2 AI‑Specific Restrictions
              </h3>
              <p className="mb-2">You specifically agree not to:</p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Attempt to manipulate or circumvent AI model safeguards</li>
                <li>
                  Use outputs to develop competing AI models without permission
                </li>
                <li>
                  Generate content that violates privacy rights or creates
                  unauthorized representations of real people
                </li>
                <li>
                  Use the Service for surveillance or monitoring without proper
                  consent
                </li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                10. Privacy and Data Protection
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                10.1 Privacy Policy
              </h3>
              <p className="mb-4">
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which is
                incorporated into these Terms by reference.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                10.2 Data Processing
              </h3>
              <p className="mb-4">
                We process your data in accordance with applicable Indian data
                protection laws and regulations, including the Information
                Technology Act, 2000, and related rules.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                10.3 AI Model Improvement
              </h3>
              <p className="mb-4">
                We may use aggregated, anonymized usage data to improve our AI
                models and Service. We will not use your specific User Content
                for AI training without your explicit consent.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                11. Service Availability and Modifications
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                11.1 Service Availability
              </h3>
              <p className="mb-4">
                While we strive to maintain continuous service availability, we
                do not guarantee uninterrupted access. The Service may be
                temporarily unavailable due to maintenance, updates, or
                technical issues.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                11.2 Service Changes
              </h3>
              <p className="mb-4">
                We reserve the right to modify, suspend, or discontinue any
                aspect of the Service at any time. We will provide reasonable
                notice of material changes that significantly affect your use of
                the Service.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                11.3 Website Updates
              </h3>
              <p className="mb-4">
                We may update the Website and its content at any time without
                notice. We do not guarantee that the Website will be free from
                errors or that defects will be corrected.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                12. Disclaimers and Limitations
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                12.1 AI Technology Limitations
              </h3>
              <p className="mb-2">
                You acknowledge that AI systems have inherent limitations,
                including:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>
                  Potential for generating inaccurate, biased, or inappropriate
                  content
                </li>
                <li>Inability to guarantee factual accuracy of outputs</li>
                <li>
                  Dependence on training data that may contain biases or errors
                </li>
                <li>
                  Possible generation of content that may infringe third‑party
                  rights
                </li>
              </ul>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                12.2 No Professional Advice
              </h3>
              <p className="mb-4">
                Generated Content and information provided through the Service
                do not constitute professional advice (legal, medical,
                financial, technical, or otherwise). Always consult qualified
                professionals for specific advice.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                12.3 Warranty Disclaimer
              </h3>
              <p className="mb-4 font-bold text-black">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, NON‑INFRINGEMENT, OR THAT THE SERVICE WILL
                BE UNINTERRUPTED OR ERROR‑FREE.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                13. Liability Limitations
              </h2>
              <p className="mb-2 font-bold text-black">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, QUESTPODAI
                SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES
                </li>
                <li>
                  LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES
                </li>
                <li>
                  DAMAGES RESULTING FROM YOUR USE OF GENERATED CONTENT OR USER
                  CONTENT
                </li>
                <li>
                  DAMAGES EXCEEDING THE TOTAL AMOUNT PAID BY YOU TO
                  QUESTPODAI IN THE 12 MONTHS PRECEDING THE CLAIM
                </li>
              </ul>
              <p className="mb-4">
                Some jurisdictions do not allow limitation of liability, so
                these limitations may not apply to you.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                14. Indemnification
              </h2>
              <p className="mb-2">
                You agree to indemnify, defend, and hold harmless QuestpodAI,
                its partners, officers, agents, and employees from and against
                any claims, liabilities, damages, losses, costs, or expenses
                arising from:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Your use of the Service</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third‑party rights</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                15. Termination
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                15.1 Termination by You
              </h3>
              <p className="mb-4">
                You may terminate your account and stop using the Service at any
                time by following the cancellation process in your account
                settings.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                15.2 Termination by Us
              </h3>
              <p className="mb-2">
                We may suspend or terminate your account and access to the
                Service immediately, without prior notice, if you breach these
                Terms or for other legitimate reasons, including but not limited
                to:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Violation of acceptable use policies</li>
                <li>Non-payment of fees</li>
                <li>Fraudulent or illegal activity</li>
                <li>Prolonged inactivity</li>
              </ul>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                15.3 Effect of Termination
              </h3>
              <p className="mb-2">Upon termination:</p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Your right to use the Service ceases immediately</li>
                <li>
                  You remain liable for all charges incurred prior to
                  termination
                </li>
                <li>
                  We may delete your account and User Content after a reasonable
                  period
                </li>
                <li>
                  Provisions that by their nature should survive termination
                  will remain in effect
                </li>
              </ul>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                16. Governing Law and Jurisdiction
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                16.1 Governing Law
              </h3>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to conflict of law
                principles.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                16.2 Jurisdiction
              </h3>
              <p className="mb-4">
                Any disputes arising under or in connection with these Terms
                shall be subject to the exclusive jurisdiction of the courts
                located in Bangalore, Karnataka, India.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                16.3 Dispute Resolution
              </h3>
              <p className="mb-4">
                Before initiating any legal proceedings, the parties agree to
                attempt to resolve disputes through good faith negotiations. If
                negotiations fail, disputes will be resolved through the court
                system as specified above.
              </p>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                17. Compliance with Indian Laws
              </h2>
              <p className="mb-2">
                You agree to comply with all applicable Indian laws and
                regulations, including but not limited to:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>Information Technology Act, 2000</li>
                <li>Consumer Protection Act, 2019</li>
                <li>Indian Copyright Act, 1957</li>
                <li>Foreign Exchange Management Act (FEMA), if applicable</li>
                <li>Any other relevant central or state legislation</li>
              </ul>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                18. General Provisions
              </h2>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.1 Entire Agreement
              </h3>
              <p className="mb-4">
                These Terms, together with our Privacy Policy and any other
                legal notices published on the Website, constitute the entire
                agreement between you and QuestpodAI regarding the Service.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.2 Amendment
              </h3>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes by posting the updated Terms on
                the Website and updating the "Last Updated" date. Your continued
                use of the Service after such modifications constitutes
                acceptance of the updated Terms.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.3 Severability
              </h3>
              <p className="mb-4">
                If any provision of these Terms is held to be invalid, illegal,
                or unenforceable, the remaining provisions shall continue in
                full force and effect.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.4 No Waiver
              </h3>
              <p className="mb-4">
                Our failure to enforce any provision of these Terms shall not
                constitute a waiver of that provision or any other provision.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.5 Assignment
              </h3>
              <p className="mb-4">
                You may not transfer or assign your rights or obligations under
                these Terms without our prior written consent. We may assign our
                rights and obligations under these Terms without restriction.
              </p>
              <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
                18.6 Force Majeure
              </h3>
              <p className="mb-4">
                QuestpodAI shall not be liable for any failure or delay in
                performance due to circumstances beyond our reasonable control,
                including but not limited to acts of God, natural disasters,
                war, terrorism, strikes, or government actions.
              </p>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                19. Contact Information
              </h2>
              <p className="mb-2">
                For questions, concerns, or disputes regarding these Terms and
                Conditions, you may contact us:
              </p>
              <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
                <li>
                  <strong>By Email: </strong>
                  <a
                    href="mailto:hello@questpodai.com"
                    className="text-blue-600 hover:underline"
                  >
                    hello@questpodai.com
                  </a>
                </li>

                <li>
                  <strong>By visiting our website:</strong> Please visit the{" "}
                  <a
                    href="/contact"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    contact page
                  </a>{" "}
                  on{" "}
                  <a
                    href="https://www.questpodai.com"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.questpodai.com
                  </a>{" "}
                  for additional contact options and support information.
                </li>

                <li>
                  <strong> Business Address:</strong>
                  <address className="not-italic ml-5 mt-1">
                    QuestpodAI
                    <br />
                    Bangalore, Karnataka, India
                  </address>
                </li>
              </ul>
              <p className="mt-6 text-base font-bold">
                By accessing or using{" "}
                <a
                  href="https://www.questpodai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.questpodai.com
                </a>{" "}
                and our Services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
