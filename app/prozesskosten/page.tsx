'use client';

import Link from 'next/Link';
import { useEffect, useState} from 'react';

interface ProzessDaten {
    // ===== Applications =====
    application_amt: number;
    application_cost: number;
    application_cost_rate: number;
    appl_umlagesatz: number;
    appl_gesamt: number;
  
    // ===== Interview =====
    interview_amt: number;
    interview_cost: number;
    interview_cost_rate: number;
    interview_umlagesatz: number;
    interview_gesamt: number;
  
    // ===== Psychologische Tests =====
    psych_amt: number;
    psych_cost: number;
    psych_cost_rate: number;
    psych_umlagesatz: number;
    psych_gesamt: number;
  
    // ===== Abteilungsleiter =====
    abteilung_umlagesatz: number;
  }

  