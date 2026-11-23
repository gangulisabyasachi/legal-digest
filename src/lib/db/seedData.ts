import { IJudgment } from '../models/Judgment';
import { IUser } from '../models/User';
import { IResearchFolder, IBookmark } from '../models/Bookmark';
import bcrypt from 'bcryptjs';

// Pre-hashed password for demo accounts: "Password123!"
const DEMO_PASSWORD_HASH = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1q3fW8xJp6Nlmq2F1M9zP0U7kR0b.W';

export const initialUsers: IUser[] = [
  {
    id: 'user_admin_01',
    name: 'Chief Editor (Admin)',
    email: 'admin@legaldigest.org',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'superadmin',
    organization: 'Supreme Court Digest Bureau',
    designation: 'Senior Editor & Advocate',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user_editor_01',
    name: 'Advocate Radhika Sharma',
    email: 'editor@legaldigest.org',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'editor',
    organization: 'Bar Council of Delhi',
    designation: 'Associate Legal Editor',
    status: 'active',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'user_subscriber_01',
    name: 'Adv. Sabyasachi Ganguli',
    email: 'lawyer@chamber.in',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'subscriber',
    organization: 'High Court Chamber',
    designation: 'Advocate on Record',
    status: 'active',
    createdAt: '2024-03-10T00:00:00Z',
  },
];

export const initialFolders: IResearchFolder[] = [
  {
    id: 'folder_01',
    userId: 'user_subscriber_01',
    name: 'Constitutional Rights & Privacy',
    description: 'Landmark Article 21 and digital rights precedents for upcoming writ petition.',
    color: '#007398',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z',
  },
  {
    id: 'folder_02',
    userId: 'user_subscriber_01',
    name: 'Arrest & Bail Jurisprudence (Sec 41A)',
    description: 'Guidelines on notice of appearance, anticipatory bail, and magistrate remand scrutiny.',
    color: '#E25822',
    createdAt: '2024-04-05T12:30:00Z',
    updatedAt: '2024-04-05T12:30:00Z',
  },
  {
    id: 'folder_03',
    userId: 'user_subscriber_01',
    name: 'Arbitration & Group of Companies Doctrine',
    description: 'Commercial arbitration precedents on non-signatory binding under Section 7 & 8.',
    color: '#059669',
    createdAt: '2024-04-10T09:15:00Z',
    updatedAt: '2024-04-10T09:15:00Z',
  },
];

export const initialBookmarks: IBookmark[] = [
  {
    id: 'bm_01',
    userId: 'user_subscriber_01',
    judgmentId: 'jdg_puttaswamy_privacy',
    folderId: 'folder_01',
    personalNotes: 'Para 310 contains the core 3-fold proportionality test: Legitimate State Aim, Suitability, and Necessity.',
    tags: ['privacy', 'art-21', 'proportionality'],
    createdAt: '2024-04-02T11:20:00Z',
  },
  {
    id: 'bm_02',
    userId: 'user_subscriber_01',
    judgmentId: 'jdg_arnesh_kumar_bail',
    folderId: 'folder_02',
    personalNotes: 'Mandatory Section 41 CrPC checklist must be furnished by investigating officer before remand.',
    tags: ['bail', 'arrest', 'sec-41a'],
    createdAt: '2024-04-06T14:45:00Z',
  },
];

export const initialJudgments: IJudgment[] = [
  {
    id: 'jdg_puttaswamy_privacy',
    caseTitle: 'Justice K.S. Puttaswamy (Retd.) and Anr. v. Union of India and Ors.',
    petitioner: 'Justice K.S. Puttaswamy (Retd.)',
    respondent: 'Union of India and Ors.',
    citation: '(2017) 10 SCC 1 | 2017 INSC 672',
    court: 'Supreme Court of India',
    bench: [
      'J.S. Khehar, CJI',
      'J. Chelameswar, J.',
      'S.A. Bobde, J.',
      'R.K. Agrawal, J.',
      'R.F. Nariman, J.',
      'A.M. Sapre, J.',
      'Dr. D.Y. Chandrachud, J.',
      'Sanjay Kishan Kaul, J.',
      'S. Abdul Nazeer, J.',
    ],
    dateOfJudgment: '2017-08-24',
    caseNumber: 'Writ Petition (Civil) No. 494 of 2012',
    jurisdiction: 'Constitutional Appellate & Original Jurisdiction (9-Judge Bench)',
    catchwords: [
      'CONSTITUTIONAL LAW',
      'FUNDAMENTAL RIGHTS',
      'ARTICLE 21',
      'RIGHT TO PRIVACY',
      'NATURAL RIGHTS',
      'PROPORTIONALITY TEST',
      'INFORMATIONAL PRIVACY',
      'OVERRULING OF MP SHARMA & ADM JABALPUR',
    ],
    headnote:
      'A unanimous 9-Judge Constitution Bench of the Supreme Court held that the right to privacy is a fundamental right emanating primarily from Article 21 (Protection of life and personal liberty) and Part III of the Constitution of India. Privacy encompasses spatial, bodily, and informational autonomy. The Court unequivocally overruled the historic rulings in M.P. Sharma v. Satish Chandra (1954) and Kharak Singh v. State of U.P. (1963) to the extent that they held privacy was not protected under the Constitution. Any encroachment upon privacy by the State must strictly satisfy the 3-pronged constitutional test of legality, legitimate state aim, and proportionality.',
    ratioDecidendi:
      'The right to privacy is intrinsic to life and liberty under Article 21 and is protected as an inalienable natural right under Part III. An invasion of privacy by State action can only be sustained if it satisfies threefold requirements: (i) Existence of a law authorizing such encroachment; (ii) A legitimate State objective; and (iii) Proportionality between the nature of the interference and the state goal pursued.',
    issues: [
      'Whether the right to privacy is a constitutionally protected fundamental right under Part III of the Constitution of India.',
      'Whether the earlier decisions in M.P. Sharma (1954) 8-Judge bench and Kharak Singh (1963) 6-Judge bench settled that privacy is not a fundamental right.',
      'What are the permissible constitutional limitations and standards of scrutiny for State incursions into personal and informational privacy?',
    ],
    holding:
      'The references answered in the affirmative. Privacy is declared a fundamental right guaranteed under Article 21. Decisions in M.P. Sharma and Kharak Singh overruled. Matter remitted to regular bench to determine the validity of the Aadhaar scheme on the touchstone of proportionality.',
    statutesCited: [
      {
        act: 'Constitution of India, 1950',
        sections: ['Article 14', 'Article 19(1)(a)', 'Article 21', 'Article 25', 'Article 32'],
      },
      {
        act: 'Information Technology Act, 2000',
        sections: ['Section 43A', 'Section 69', 'Section 72A'],
      },
    ],
    casesReferred: [
      {
        caseName: 'M.P. Sharma v. Satish Chandra',
        citation: '1954 SCR 1077',
        treatment: 'Overruled',
      },
      {
        caseName: 'Kharak Singh v. State of U.P.',
        citation: '(1964) 1 SCR 332',
        treatment: 'Overruled',
      },
      {
        caseName: 'Maneka Gandhi v. Union of India',
        citation: '(1978) 1 SCC 248',
        treatment: 'Followed',
      },
      {
        caseName: 'Govind v. State of Madhya Pradesh',
        citation: '(1975) 2 SCC 148',
        treatment: 'Considered',
      },
    ],
    pdfUrl: '/samples/puttaswamy_judgment.pdf',
    pdfFileName: 'puttaswamy_landmark_2017.pdf',
    fullText:
      'IN THE SUPREME COURT OF INDIA\nORIGINAL JURISDICTION\nWRIT PETITION (CIVIL) NO. 494 OF 2012\n\nJUSTICE K.S. PUTTASWAMY (RETD.) AND ANR. ...PETITIONERS\nVERSUS\nUNION OF INDIA AND ORS. ...RESPONDENTS\n\nJUDGMENT\nDr D.Y. CHANDRACHUD, J. (for himself, J.S. Khehar, C.J., R.K. Agrawal and S. Abdul Nazeer, JJ.):\n\n1. The pristine question that falls for determination before this nine judge Bench is whether the right to privacy is a fundamental right under the Constitution of India...\n\nPrivacy is the constitutional core of human dignity. Without dignity, human existence is diminished of meaning. To live is to live with dignity. The right to privacy is an intrinsic part of the right to life and personal liberty enshrined in Article 21 of the Constitution.',
    status: 'published',
    isLandmark: true,
    publishedAt: '2017-08-24T12:00:00Z',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'jdg_arnesh_kumar_bail',
    caseTitle: 'Arnesh Kumar v. State of Bihar and Anr.',
    petitioner: 'Arnesh Kumar',
    respondent: 'State of Bihar and Anr.',
    citation: '(2014) 8 SCC 273 | 2014 INSC 473',
    court: 'Supreme Court of India',
    bench: ['Chandramauli Kr. Prasad, J.', 'Pinaki Chandra Ghose, J.'],
    dateOfJudgment: '2014-07-02',
    caseNumber: 'Criminal Appeal No. 1277 of 2014',
    jurisdiction: 'Criminal Appellate Jurisdiction',
    catchwords: [
      'CRIMINAL LAW',
      'CODE OF CRIMINAL PROCEDURE',
      'SECTION 498A IPC',
      'SECTION 41 CRPC',
      'SECTION 41A NOTICE',
      'UNLAWFUL ARREST',
      'JUDICIAL REMAND SAFEGUARDS',
      'DEPARTMENTAL ACTION AGAINST POLICE',
    ],
    headnote:
      'The Supreme Court laid down exhaustive mandatory directives regulating the power of arrest by police officers in offences punishable with imprisonment for a term up to seven years, particularly under Section 498-A of the Indian Penal Code. The Court emphasized that arrest brings humiliation and curtails liberty. A police officer cannot arrest merely because a complaint is lodged; subjective satisfaction on statutory parameters of Section 41(1)(b) must be recorded in writing before arresting an accused person. Magistrates are strictly instructed not to authorize detention mechanically without perusing the police checklist.',
    ratioDecidendi:
      'Arrest should not be made routinely on mere allegation. For offences punishable up to 7 years, police must serve a notice of appearance under Section 41A CrPC within two weeks from institution of case. Arrest is permissible only when conditions specified under Section 41(1)(b)(ii) exist, and the officer must document reasons in a checklist. Failure by police will invite contempt of court and departmental disciplinary proceedings; failure by Magistrate will invite High Court disciplinary action.',
    issues: [
      'Whether routine and mechanical arrests under Section 498A IPC and dowry offences without statutory necessity infringe constitutional guarantees under Articles 21 and 22.',
      'What are the duties of the police officer and the remand Magistrate under Sections 41, 41-A and 167 CrPC?',
    ],
    holding:
      'Appeal allowed. Provisional bail made absolute. Mandatory 8-point directions issued to all State Governments, Directors General of Police, and High Courts across India governing arrests and remands.',
    statutesCited: [
      {
        act: 'Indian Penal Code, 1860',
        sections: ['Section 498A', 'Section 406'],
      },
      {
        act: 'Code of Criminal Procedure, 1973',
        sections: ['Section 41', 'Section 41A', 'Section 41B', 'Section 57', 'Section 167'],
      },
      {
        act: 'Dowry Prohibition Act, 1961',
        sections: ['Section 4'],
      },
    ],
    casesReferred: [
      {
        caseName: 'Joginder Kumar v. State of U.P.',
        citation: '(1994) 4 SCC 260',
        treatment: 'Followed',
      },
      {
        caseName: 'D.K. Basu v. State of West Bengal',
        citation: '(1997) 1 SCC 416',
        treatment: 'Followed',
      },
    ],
    pdfUrl: '/samples/arnesh_kumar_bail.pdf',
    pdfFileName: 'arnesh_kumar_2014.pdf',
    fullText:
      'IN THE SUPREME COURT OF INDIA\nCRIMINAL APPELLATE JURISDICTION\nCRIMINAL APPEAL NO. 1277 OF 2014\n\nARNESH KUMAR ...APPELLANT\nVERSUS\nSTATE OF BIHAR & ANR. ...RESPONDENTS\n\nJUDGMENT\nChandramauli Kr. Prasad, J.:\n\n1. The petitioner apprehends arrest in a case registered under Section 498-A of the Indian Penal Code, 1860 and Section 4 of the Dowry Prohibition Act, 1961. The question of arrest and detention touches the personal liberty of a citizen...',
    status: 'published',
    isLandmark: true,
    publishedAt: '2014-07-02T10:00:00Z',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'jdg_cox_kings_arbitration',
    caseTitle: 'Cox and Kings Ltd. v. SAP India Pvt. Ltd. and Anr.',
    petitioner: 'Cox and Kings Ltd.',
    respondent: 'SAP India Pvt. Ltd. and Anr.',
    citation: '(2024) 4 SCC 1 | 2023 INSC 1051',
    court: 'Supreme Court of India',
    bench: [
      'Dr. D.Y. Chandrachud, CJI',
      'Hrishikesh Roy, J.',
      'P.S. Narasimha, J.',
      'J.B. Pardiwala, J.',
      'Manoj Misra, J.',
    ],
    dateOfJudgment: '2023-12-06',
    caseNumber: 'Arbitration Petition No. 38 of 2020',
    jurisdiction: 'Constitution Bench (5-Judge Bench)',
    catchwords: [
      'COMMERCIAL LAW',
      'ARBITRATION AND CONCILIATION ACT 1996',
      'SECTION 7',
      'SECTION 8 & 11',
      'GROUP OF COMPANIES DOCTRINE',
      'NON-SIGNATORIES',
      'MUTUAL INTENT',
      'COMMONSENSE COMMERCIAL TEST',
    ],
    headnote:
      'A 5-Judge Constitution Bench upheld the validity of the "Group of Companies" doctrine in Indian arbitration law, locating its foundation within the consensual framework of Section 7 of the Arbitration and Conciliation Act, 1996. The Court clarified that non-signatory affiliates of a corporate group can be bound by an arbitration agreement if there is clear mutual intention of all parties, deduced from involvement in negotiation, performance, or termination of the underlying commercial agreement.',
    ratioDecidendi:
      'The "Group of Companies" doctrine is rooted in the definition of an arbitration agreement under Section 7. Mere corporate affiliation or being part of the same corporate group is insufficient; the referral court or tribunal must examine cumulative factors including mutual intent, direct involvement in negotiations, performance, and commercial reality.',
    issues: [
      'Whether the Group of Companies doctrine should be read into Section 7 of the Arbitration and Conciliation Act, 1996.',
      'Whether the earlier judgments in Chloro Controls and subsequent decisions require reconsideration.',
      'At what stage (Section 8/11 referral stage vs Section 16 arbitral tribunal stage) should the question of binding a non-signatory be decided?',
    ],
    holding:
      'The Group of Companies doctrine affirmed with refined guidelines. The referral court under Section 8 or 11 must limit scrutiny to prima facie existence of arbitration agreement, leaving detailed factual determination of non-signatory binding to the arbitral tribunal under Section 16.',
    statutesCited: [
      {
        act: 'Arbitration and Conciliation Act, 1996',
        sections: ['Section 7', 'Section 8', 'Section 9', 'Section 11', 'Section 16'],
      },
      {
        act: 'Companies Act, 2013',
        sections: ['Section 2(87)'],
      },
    ],
    casesReferred: [
      {
        caseName: 'Chloro Controls India (P) Ltd. v. Severn Trent Water Purification Inc.',
        citation: '(2013) 1 SCC 641',
        treatment: 'Considered',
      },
      {
        caseName: 'Vidya Drolia v. Durga Trading Corpn.',
        citation: '(2021) 2 SCC 1',
        treatment: 'Followed',
      },
    ],
    pdfUrl: '/samples/cox_kings_arbitration.pdf',
    pdfFileName: 'cox_kings_arbitration_2023.pdf',
    fullText:
      'IN THE SUPREME COURT OF INDIA\nCIVIL ORIGINAL JURISDICTION\nARBITRATION PETITION NO. 38 OF 2020\n\nCOX AND KINGS LTD. ...PETITIONER\nVERSUS\nSAP INDIA PVT. LTD. & ANR. ...RESPONDENTS\n\nJUDGMENT\nDr D.Y. Chandrachud, CJI:\n\n1. This reference to a Constitution Bench of five judges concerns the modern interpretation of the Group of Companies doctrine in international and domestic commercial arbitration...',
    status: 'published',
    isLandmark: true,
    publishedAt: '2023-12-06T11:00:00Z',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
];
