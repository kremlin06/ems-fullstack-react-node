// src/components/LearnMore.jsx
// Onboarding "Learn More" educational gateway. Bridges the public landing page
// and the secure role-based dashboards by explaining the system's purpose, its
// feature set, the value each campus role gains, the technical standards, and the
// honest Phase 1 scope. Professional SVG icons only (no emojis), frosted glass
// cards, fluid clamp() typography, and a CTA back into the auth flow.

import { Link } from 'react-router-dom';
import Button from './Button';
import {
   EventSVG,
   UploadSVG,
   QrCodeSVG,
   ChartBarSVG,
   UserSVG,
   UsersSVG,
   CameraSVG,
   SmartphoneSVG,
   ShieldCheckSVG,
   ZapSVG,
   CheckCircleSVG,
   InfoSVG,
   ArrowRightSVG,
} from './SVGs';
import {
   LearnMoreSection,
   Container,
   SectionHeader,
   Eyebrow,
   Title,
   Lede,
   Highlight,
   SubHeading,
   FeatureGrid,
   RoleGrid,
   SpecGrid,
   GlassCard,
   CardIcon,
   RoleHeader,
   BenefitList,
   BenefitItem,
   LimitationCard,
   LimitationItem,
   CtaPanel,
   CtaButtonInner,
} from '../styles/LearnMore.styles';

// 2. feature spotlights — "what it does"
const features = [
   {
      icon: EventSVG,
      title: 'Multi-Session Management',
      body: (
         <>Build complex events with hierarchical, multi-session schedules and assign a
         dedicated facilitator to each individual session.</>
      ),
   },
   {
      icon: UploadSVG,
      title: 'Validated Attendee Ingestion',
      body: (
         <>A bulk-upload engine ingests up to <Highlight>10,000</Highlight> attendee records
         at once, with a server-side validation accuracy of <Highlight>&ge;95%</Highlight>.</>
      ),
   },
   {
      icon: QrCodeSVG,
      title: 'QR Scanning Technology',
      body: (
         <>A high-performance scanner marks attendance instantly as Present, Late, or Absent
         and pushes the result to every dashboard in real time.</>
      ),
   },
   {
      icon: ChartBarSVG,
      title: 'Automated Analytics',
      body: (
         <>Raw check-ins are transformed into participation rates and session-level analytics
         in <Highlight>under 2 seconds</Highlight>.</>
      ),
   },
];

// 3. value propositions by role
const roles = [
   {
      icon: UserSVG,
      title: 'For Attendees',
      benefits: [
         'Personalised schedules in a clean vertical timeline.',
         'Hassle-free check-ins using a personal My QR Code.',
      ],
   },
   {
      icon: CameraSVG,
      title: 'For Staff & Facilitators',
      benefits: [
         'Mobile-optimised camera interface for on-the-go scanning.',
         'Manual override tools to verify students when needed.',
      ],
   },
   {
      icon: UsersSVG,
      title: 'For Organizers & Admins',
      benefits: [
         'Data-driven decisions from real-time dashboards.',
         'Export participation reports in CSV or PDF formats.',
      ],
   },
];

// 4. technical specifications — "system readiness"
const specs = [
   {
      icon: SmartphoneSVG,
      title: 'Mobile-First Design',
      body: (
         <>A fully responsive web application optimised for mobile browsers — no local
         installation required.</>
      ),
   },
   {
      icon: ShieldCheckSVG,
      title: 'Security Standards',
      body: (
         <>JWT-based role access and enforced HTTPS protect student Personally Identifiable
         Information (PII).</>
      ),
   },
   {
      icon: ZapSVG,
      title: 'Performance',
      body: (
         <>Tuned to return roster queries for <Highlight>5,000+</Highlight> attendees in
         <Highlight> under 2 seconds</Highlight>.</>
      ),
   },
];

// 5. phase 1 scope & limitations
const limitations = [
   {
      label: 'No Financials',
      text: 'Online payment processing and paid ticketing are out of scope for this release.',
   },
   {
      label: 'Communication',
      text: 'Notifications are limited to in-app messages and basic attendance confirmations.',
   },
   {
      label: 'Platform',
      text: 'Targets web browsers only; native iOS and Android apps are deferred to later phases.',
   },
];

const LearnMore = () => {
   return (
      <LearnMoreSection id="learn-more">
         <Container>
            {/* 1. general system overview */}
            <SectionHeader>
               <Eyebrow>Learn More</Eyebrow>
               <Title>One platform for every campus event</Title>
               <Lede>
                  The Event Management System is a centralized, web-based platform that
                  automates campus event coordination — replacing manual spreadsheets and
                  paper logs. It removes the manual encoding errors, lost records, and
                  scheduling conflicts that come with running events by hand.
               </Lede>
            </SectionHeader>

            {/* 2. feature spotlights */}
            <SubHeading>What it does</SubHeading>
            <FeatureGrid>
               {features.map(({ icon: Icon, title, body }) => (
                  <GlassCard key={title}>
                     <CardIcon>
                        <Icon size={24} />
                     </CardIcon>
                     <h4>{title}</h4>
                     <p>{body}</p>
                  </GlassCard>
               ))}
            </FeatureGrid>

            {/* 3. value propositions by role */}
            <SubHeading>What you gain by role</SubHeading>
            <RoleGrid>
               {roles.map(({ icon: Icon, title, benefits }) => (
                  <GlassCard key={title}>
                     <RoleHeader>
                        <CardIcon>
                           <Icon size={24} />
                        </CardIcon>
                        <h4>{title}</h4>
                     </RoleHeader>
                     <BenefitList>
                        {benefits.map((benefit) => (
                           <BenefitItem key={benefit}>
                              <CheckCircleSVG size={18} />
                              <span>{benefit}</span>
                           </BenefitItem>
                        ))}
                     </BenefitList>
                  </GlassCard>
               ))}
            </RoleGrid>

            {/* 4. technical specifications & standards */}
            <SubHeading>System readiness</SubHeading>
            <SpecGrid>
               {specs.map(({ icon: Icon, title, body }) => (
                  <GlassCard key={title}>
                     <CardIcon>
                        <Icon size={24} />
                     </CardIcon>
                     <h4>{title}</h4>
                     <p>{body}</p>
                  </GlassCard>
               ))}
            </SpecGrid>

            {/* 5. phase 1 scope & limitations — commented out on request.
                the LimitationCard, LimitationItem, InfoSVG, and the limitations
                data array are kept in the file for reference.
            <SubHeading>Phase 1 scope</SubHeading>
            <LimitationCard>
               {limitations.map(({ label, text }) => (
                  <LimitationItem key={label}>
                     <InfoSVG size={20} />
                     <span>
                        <strong>{label}:</strong> {text}
                     </span>
                  </LimitationItem>
               ))}
            </LimitationCard>
            */}

            {/* bottom CTA — drive users back into the authentication flow */}
            <CtaPanel>
               <h3>Ready to get started?</h3>
               <p>
                  Create your account in seconds and start coordinating campus events with
                  confidence.
               </p>
               <Button as={Link} to="/signup" variant="primary">
                  <CtaButtonInner>
                     Sign Up Now
                     <ArrowRightSVG size={18} />
                  </CtaButtonInner>
               </Button>
            </CtaPanel>
         </Container>
      </LearnMoreSection>
   );
};

export default LearnMore;
