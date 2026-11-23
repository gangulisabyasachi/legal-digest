export interface IStatuteCited {
  act: string;
  sections: string[];
}

export interface ICaseReferred {
  caseName: string;
  citation?: string;
  treatment?: 'Followed' | 'Distinguished' | 'Overruled' | 'Considered' | 'Referred';
}

export interface IJudgment {
  id: string;
  caseTitle: string;
  petitioner?: string;
  respondent?: string;
  citation: string;
  court: string; // e.g. "Supreme Court of India", "High Court of Delhi"
  bench: string[]; // e.g. ["Dr. D.Y. Chandrachud, CJI", "J.B. Pardiwala, J."]
  dateOfJudgment: string; // ISO string e.g. "2024-05-15"
  caseNumber?: string; // e.g. "Civil Appeal No. 1234 of 2021"
  jurisdiction?: string; // e.g. "Civil Appellate Jurisdiction"
  
  // Structured Headnote & Legal Digest Fields
  catchwords: string[]; // e.g. ["CONSTITUTIONAL LAW", "ARTICLE 21", "RIGHT TO PRIVACY"]
  headnote: string; // Core summary / abstract
  ratioDecidendi: string; // Exact legal principle laid down
  issues: string[]; // Key legal questions framed
  holding: string; // Operative order / disposition
  
  // Statutory and Precedent Analysis
  statutesCited: IStatuteCited[];
  casesReferred: ICaseReferred[];
  
  // Document Links & Full Text
  pdfUrl?: string; // Local path or cloud URL
  pdfFileName?: string;
  fullText?: string; // Extracted full judgment text
  
  // Editorial and Publishing Workflow
  status: 'draft' | 'under_review' | 'published';
  isLandmark?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
