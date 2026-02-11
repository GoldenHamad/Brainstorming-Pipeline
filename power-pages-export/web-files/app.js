/**
 * ============================================================
 * Advisory AI Ideas — Power Pages Application JavaScript
 * ============================================================
 *
 * This file provides:
 *   AppApi   — Dataverse Web API wrapper (CRUD for all tables)
 *   AppData  — Choice/enum lookup helpers and reference data
 *   AppUI    — Shared rendering utilities (cards, toasts, stars)
 *
 * It is loaded on every page via the Layout web template.
 * All Dataverse operations use the Power Pages Web API
 * (/_api/cr7b4_ai_ideas, /_api/cr7b4_ai_ideaassessments, etc.)
 * which must be enabled in Site Settings.
 */

// ============================================================
// AppData — Reference data & choice lookups
// ============================================================

var AppData = (function () {
  'use strict';

  var AI_CAPABILITIES = [
    'Generative AI', 'Machine Learning', 'Natural Language Processing',
    'Computer Vision', 'Robotic Process Automation', 'Predictive Analytics',
    'Conversational AI', 'Document Intelligence'
  ];

  var BUSINESS_FUNCTIONS = [
    'Audit', 'Tax', 'Advisory', 'Deal Advisory', 'IT', 'Operations',
    'Human Resources', 'Finance', 'Marketing', 'Legal', 'Risk & Compliance'
  ];

  var IDEA_STATUSES = [
    { value: 100000000, label: 'Submitted',    key: 'submitted' },
    { value: 100000001, label: 'Screening',    key: 'screening' },
    { value: 100000002, label: 'Assessment',   key: 'assessment' },
    { value: 100000003, label: 'Prioritized',  key: 'prioritized' },
    { value: 100000004, label: 'Development',  key: 'development' },
    { value: 100000005, label: 'Pilot',        key: 'pilot' },
    { value: 100000006, label: 'Deployed',     key: 'deployed' },
    { value: 100000007, label: 'Scaling',      key: 'scaling' },
    { value: 100000008, label: 'On Hold',      key: 'on_hold' },
    { value: 100000009, label: 'Rejected',     key: 'rejected' },
    { value: 100000010, label: 'Archived',     key: 'archived' }
  ];

  var QUADRANTS = [
    { value: 100000000, label: 'Likely Wins',      key: 'likely_wins' },
    { value: 100000001, label: 'Calculated Risks',  key: 'calculated_risks' },
    { value: 100000002, label: 'Marginal Gains',    key: 'marginal_gains' },
    { value: 100000003, label: 'Avoid',              key: 'avoid' }
  ];

  var SCORE_LEVELS = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' }
  ];

  var PROMPT_CATEGORIES = [
    'Client Deliverables', 'Internal Productivity', 'Research & Analysis',
    'Data & Finance', 'Creative & Marketing', 'Technical'
  ];

  var COMPLEXITY_LEVELS = [
    { value: 100000000, label: 'Beginner' },
    { value: 100000001, label: 'Intermediate' },
    { value: 100000002, label: 'Expert' }
  ];

  var AI_TOOLS = ['ChatGPT', 'Microsoft Copilot', 'Google Gemini', 'Claude', 'Internal AI'];

  var OUTPUT_FORMATS = [
    'Bullet points', 'Table', 'Narrative',
    'Structured narrative with bullet points', 'Code', 'JSON', 'Markdown'
  ];

  var PROMPT_STATUSES = [
    { value: 100000000, label: 'Draft' },
    { value: 100000001, label: 'Pending' },
    { value: 100000002, label: 'Approved' },
    { value: 100000003, label: 'Rejected' },
    { value: 100000004, label: 'Archived' }
  ];

  /**
   * Generic choice label resolver.
   * @param {string} choiceName  e.g. 'IdeaStatus', 'PromptCategory'
   * @param {number} value       the integer choice value
   * @returns {string}
   */
  function getChoiceLabel (choiceName, value) {
    if (value === null || value === undefined) return '—';

    switch (choiceName) {
      case 'IdeaStatus': {
        var s = IDEA_STATUSES.find(function (x) { return x.value === value; });
        return s ? s.label : String(value);
      }
      case 'AICapabilityArea': {
        var idx = value - 100000000;
        return AI_CAPABILITIES[idx] || String(value);
      }
      case 'BusinessFunction': {
        var idx2 = value - 100000000;
        return BUSINESS_FUNCTIONS[idx2] || String(value);
      }
      case 'Quadrant': {
        var q = QUADRANTS.find(function (x) { return x.value === value; });
        return q ? q.label : String(value);
      }
      case 'ScoreLevel': {
        var sl = SCORE_LEVELS.find(function (x) { return x.value === value; });
        return sl ? sl.label : String(value);
      }
      case 'PromptCategory': {
        var idx3 = value - 100000000;
        return PROMPT_CATEGORIES[idx3] || String(value);
      }
      case 'ComplexityLevel': {
        var cl = COMPLEXITY_LEVELS.find(function (x) { return x.value === value; });
        return cl ? cl.label : String(value);
      }
      case 'OutputFormat': {
        var idx4 = value - 100000000;
        return OUTPUT_FORMATS[idx4] || String(value);
      }
      case 'PromptStatus': {
        var ps = PROMPT_STATUSES.find(function (x) { return x.value === value; });
        return ps ? ps.label : String(value);
      }
      default:
        return String(value);
    }
  }

  function getStatusKey (value) {
    var s = IDEA_STATUSES.find(function (x) { return x.value === value; });
    return s ? s.key : 'submitted';
  }

  function getQuadrantKey (value) {
    var q = QUADRANTS.find(function (x) { return x.value === value; });
    return q ? q.key : 'avoid';
  }

  return {
    AI_CAPABILITIES: AI_CAPABILITIES,
    BUSINESS_FUNCTIONS: BUSINESS_FUNCTIONS,
    IDEA_STATUSES: IDEA_STATUSES,
    QUADRANTS: QUADRANTS,
    SCORE_LEVELS: SCORE_LEVELS,
    PROMPT_CATEGORIES: PROMPT_CATEGORIES,
    COMPLEXITY_LEVELS: COMPLEXITY_LEVELS,
    AI_TOOLS: AI_TOOLS,
    OUTPUT_FORMATS: OUTPUT_FORMATS,
    PROMPT_STATUSES: PROMPT_STATUSES,
    getChoiceLabel: getChoiceLabel,
    getStatusKey: getStatusKey,
    getQuadrantKey: getQuadrantKey
  };
})();


// ============================================================
// AppApi — Dataverse Web API wrapper
// ============================================================

var AppApi = (function () {
  'use strict';

  // Power Pages Web API base path
  var API_BASE = '/_api';

  // CSRF token (required for POST/PATCH/DELETE)
  function getToken () {
    var el = document.querySelector('meta[name="csrf-token"]')
      || document.querySelector('input[name="__RequestVerificationToken"]');
    return el ? (el.content || el.value) : '';
  }

  /**
   * Generic fetch wrapper.
   */
  async function apiRequest (method, url, body) {
    var headers = {
      'Accept': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0'
    };

    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      headers['__RequestVerificationToken'] = getToken();
    }

    var opts = { method: method, headers: headers };
    if (body) opts.body = JSON.stringify(body);

    var resp = await fetch(API_BASE + url, opts);

    if (!resp.ok) {
      var errText = '';
      try { errText = await resp.text(); } catch (_) {}
      throw new Error('API ' + method + ' ' + url + ' → ' + resp.status + ': ' + errText);
    }

    if (resp.status === 204) return null; // No Content (PATCH/DELETE)
    return resp.json();
  }

  // ---------- Ideas ----------

  async function getIdeas () {
    var data = await apiRequest('GET', '/cr7b4_ai_ideas?$orderby=cr7b4_CreatedAt desc');
    return data.value || [];
  }

  async function getIdeaById (id) {
    return apiRequest('GET', '/cr7b4_ai_ideas(' + id + ')');
  }

  async function createIdea (payload) {
    return apiRequest('POST', '/cr7b4_ai_ideas', payload);
  }

  async function updateIdea (id, patch) {
    return apiRequest('PATCH', '/cr7b4_ai_ideas(' + id + ')', patch);
  }

  // ---------- Assessments ----------

  async function getAssessments () {
    var data = await apiRequest('GET', '/cr7b4_ai_ideaassessments');
    return data.value || [];
  }

  async function getAssessmentForIdea (ideaId) {
    var data = await apiRequest('GET',
      '/cr7b4_ai_ideaassessments?$filter=_cr7b4_ideaid_value eq ' + ideaId);
    return (data.value && data.value.length > 0) ? data.value[0] : null;
  }

  async function createAssessment (payload) {
    return apiRequest('POST', '/cr7b4_ai_ideaassessments', payload);
  }

  /**
   * Enrich an array of ideas with their assessments (joined client-side).
   */
  async function enrichIdeasWithAssessments (ideas) {
    var assessments = await getAssessments();
    var map = {};
    assessments.forEach(function (a) {
      map[a._cr7b4_ideaid_value] = a;
    });
    ideas.forEach(function (idea) {
      idea._assessment = map[idea.cr7b4_AI_Ideaid] || null;
    });
    return ideas;
  }

  // ---------- Prompts ----------

  async function getPrompts (opts) {
    var filter = '';
    if (opts && opts.status === 'Approved') {
      filter = '?$filter=cr7b4_PromptStatus eq 100000002&$orderby=cr7b4_UsageCount desc';
    } else {
      filter = '?$orderby=cr7b4_UsageCount desc';
    }
    var data = await apiRequest('GET', '/cr7b4_ai_prompts' + filter);
    return data.value || [];
  }

  async function getPromptById (id) {
    return apiRequest('GET', '/cr7b4_ai_prompts(' + id + ')');
  }

  async function createPrompt (payload) {
    return apiRequest('POST', '/cr7b4_ai_prompts', payload);
  }

  async function updatePrompt (id, patch) {
    return apiRequest('PATCH', '/cr7b4_ai_prompts(' + id + ')', patch);
  }

  // ---------- Ratings ----------

  async function createRating (payload) {
    return apiRequest('POST', '/cr7b4_ai_promptratings', payload);
  }

  return {
    getIdeas: getIdeas,
    getIdeaById: getIdeaById,
    createIdea: createIdea,
    updateIdea: updateIdea,
    getAssessments: getAssessments,
    getAssessmentForIdea: getAssessmentForIdea,
    createAssessment: createAssessment,
    enrichIdeasWithAssessments: enrichIdeasWithAssessments,
    getPrompts: getPrompts,
    getPromptById: getPromptById,
    createPrompt: createPrompt,
    updatePrompt: updatePrompt,
    createRating: createRating
  };
})();


// ============================================================
// AppUI — Shared rendering helpers
// ============================================================

var AppUI = (function () {
  'use strict';

  /**
   * Escape HTML special characters to prevent XSS.
   */
  function escapeHtml (str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, function (c) { return map[c]; });
  }

  /**
   * Render an idea card (used on dashboard and home page).
   */
  function renderIdeaCard (idea) {
    var statusLabel = AppData.getChoiceLabel('IdeaStatus', idea.cr7b4_Status);
    var statusKey = AppData.getStatusKey(idea.cr7b4_Status);
    var capLabel = AppData.getChoiceLabel('AICapabilityArea', idea.cr7b4_AICapabilityArea);
    var funcLabel = AppData.getChoiceLabel('BusinessFunction', idea.cr7b4_BusinessFunction);

    var quadrantHtml = '';
    if (idea._assessment) {
      var qLabel = AppData.getChoiceLabel('Quadrant', idea._assessment.cr7b4_Quadrant);
      var qKey = AppData.getQuadrantKey(idea._assessment.cr7b4_Quadrant);
      quadrantHtml = '<span class="badge badge-' + qKey + '">' + qLabel + '</span>';
    }

    return '<a href="/ideas/detail?id=' + idea.cr7b4_AI_Ideaid + '" class="idea-card" style="text-decoration:none;display:block">' +
      '<div class="flex justify-between items-center mb-sm">' +
      '<span class="badge badge-' + statusKey + '">' + statusLabel + '</span>' +
      quadrantHtml +
      '</div>' +
      '<div class="idea-title">' + escapeHtml(idea.cr7b4_Title) + '</div>' +
      '<div class="idea-desc">' + escapeHtml(idea.cr7b4_Description) + '</div>' +
      '<div class="idea-meta">' +
      '<span>' + capLabel + '</span>' +
      '<span>&bull;</span>' +
      '<span>' + funcLabel + '</span>' +
      '<span>&bull;</span>' +
      '<span>' + new Date(idea.cr7b4_CreatedAt).toLocaleDateString() + '</span>' +
      '</div></a>';
  }

  /**
   * Render star icons as HTML string for a rating value (0-5).
   */
  function renderStars (rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += '<span style="color:' + (i <= Math.round(rating) ? '#FFC107' : '#DEE2E6') + '">&#9733;</span>';
    }
    return html;
  }

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'warning'} type
   */
  function showToast (message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  }

  return {
    escapeHtml: escapeHtml,
    renderIdeaCard: renderIdeaCard,
    renderStars: renderStars,
    showToast: showToast
  };
})();
