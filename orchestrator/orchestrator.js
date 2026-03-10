/**
 * Jamal Agent Stack Orchestrator
 * 
 * Coordinates multiple AI skills:
 * - Planning with Files (persistent context)
 * - Superpowers (SWE lifecycle)
 * - Awesome Claude Code Subagents (140+ specialized agents)
 * - Skill Prompt Generator (prompt engineering)
 * - UI/UX Pro Max + SkillX (design system)
 */

const path = require('path');
const fs = require('fs');

class JamalOrchestrator {
  constructor(config = {}) {
    this.config = {
      skillsPath: config.skillsPath || path.resolve(__dirname, '../../skills'),
      planningPath: config.planningPath || path.resolve(__dirname, '../.planning'),
      ...config
    };
    
    this.skills = {
      planning: null,
      superpowers: null,
      subagents: null,
      promptGenerator: null,
      uiux: null
    };
    
    this.tasks = new Map();
  }

  /**
   * Initialize all integrated skills
   */
  async initialize() {
    console.log('[Orchestrator] Initializing Jamal Agent Stack...');
    
    try {
      await this.loadPlanningSkill();
      await this.loadSuperpowersSkill();
      await this.loadSubagentSkill();
      await this.loadPromptGeneratorSkill();
      await this.loadUIUXSkill();
      
      console.log('[Orchestrator] All skills initialized ✓');
      return true;
    } catch (error) {
      console.error('[Orchestrator] Initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Planning with Files - Persistent task context
   */
  async loadPlanningSkill() {
    const skillPath = path.join(this.config.skillsPath, 'planning-with-files');
    if (!fs.existsSync(skillPath)) {
      console.warn('[Planning] Skill not found at', skillPath);
      return;
    }
    
    this.skills.planning = {
      path: skillPath,
      status: 'loaded',
      methods: {
        startPlanning: (taskId, context) => {
          // /plan:start orchestrator.task_name
          const taskPlanDir = path.join(this.config.planningPath, taskId);
          if (!fs.existsSync(taskPlanDir)) {
            fs.mkdirSync(taskPlanDir, { recursive: true });
          }
          console.log(`[Planning] Started planning for ${taskId}`);
          return { taskId, planDir: taskPlanDir };
        },
        
        getStatus: (taskId) => {
          // /plan:status
          const taskPlanDir = path.join(this.config.planningPath, taskId);
          if (fs.existsSync(taskPlanDir)) {
            return {
              taskId,
              status: 'active',
              planDir: taskPlanDir,
              files: fs.readdirSync(taskPlanDir)
            };
          }
          return null;
        },
        
        recoverSession: (taskId) => {
          // Auto-recovery on session restart
          const taskPlanDir = path.join(this.config.planningPath, taskId);
          if (fs.existsSync(taskPlanDir)) {
            console.log(`[Planning] Session recovery: ${taskId}`);
            return true;
          }
          return false;
        }
      }
    };
    
    console.log('[Planning] ✓ Loaded (persistent context)');
  }

  /**
   * Superpowers - SWE lifecycle automation
   */
  async loadSuperpowersSkill() {
    const skillPath = path.join(this.config.skillsPath, 'superpowers');
    if (!fs.existsSync(skillPath)) {
      console.warn('[Superpowers] Skill not found at', skillPath);
      return;
    }
    
    this.skills.superpowers = {
      path: skillPath,
      status: 'loaded',
      stages: [
        'brainstorming',
        'spec-design',
        'implementation-plan',
        'subagent-dispatch',
        'review-validation'
      ],
      methods: {
        spec: (requirements) => {
          // /superpowers:spec
          console.log('[Superpowers] Phase: Spec Design');
          return { phase: 'spec', requirements };
        },
        
        plan: (spec) => {
          // /superpowers:plan
          console.log('[Superpowers] Phase: Implementation Planning');
          return { phase: 'plan', spec, tasks: [] };
        },
        
        execute: (plan) => {
          // /superpowers:execute
          console.log('[Superpowers] Phase: Subagent Dispatch & Execution');
          return { phase: 'execute', plan };
        },
        
        review: (results) => {
          // /superpowers:review
          console.log('[Superpowers] Phase: Review & Validation');
          return { phase: 'review', results };
        }
      }
    };
    
    console.log('[Superpowers] ✓ Loaded (SWE workflow)');
  }

  /**
   * Awesome Claude Code Subagents - 140+ specialized agents
   */
  async loadSubagentSkill() {
    const skillPath = path.join(this.config.skillsPath, 'awesome-claude-code-subagents');
    if (!fs.existsSync(skillPath)) {
      console.warn('[Subagents] Skill not found at', skillPath);
      return;
    }
    
    this.skills.subagents = {
      path: skillPath,
      status: 'loaded',
      categories: [
        'lang',           // Language specialists
        'framework',      // Framework experts
        'infra',         // Infrastructure & DevOps
        'db',            // Database specialists
        'tools',         // Tool specialists
        'meta'           // Meta orchestration
      ],
      methods: {
        list: () => {
          // /subagent:list
          console.log('[Subagents] Available: 140+ specialized agents');
          return this.skills.subagents.categories;
        },
        
        dispatch: (agentType, task) => {
          // /subagent:dispatch voltagent-lang-python
          console.log(`[Subagents] Dispatching: ${agentType}`);
          return { agent: agentType, task, status: 'dispatched' };
        },
        
        parallel: (agents, tasks) => {
          // Dispatch multiple agents in parallel
          console.log(`[Subagents] Parallel dispatch: ${agents.length} agents`);
          return {
            agents,
            tasks,
            status: 'parallel-execution'
          };
        }
      }
    };
    
    console.log('[Subagents] ✓ Loaded (140+ specialized agents)');
  }

  /**
   * Skill Prompt Generator - AI prompt engineering
   */
  async loadPromptGeneratorSkill() {
    const skillPath = path.join(this.config.skillsPath, 'skill-prompt-generator');
    if (!fs.existsSync(skillPath)) {
      console.warn('[Prompt Generator] Skill not found at', skillPath);
      return;
    }
    
    this.skills.promptGenerator = {
      path: skillPath,
      status: 'loaded',
      domains: [
        'portrait',      // Photography
        'design',        // Graphic design
        'interior',      // Space design
        'product',       // Product photography
        'art',          // Artistic styles
        'video',        // Video generation
        'common',       // Common techniques
        'cross-domain'  // Multi-domain
      ],
      methods: {
        portrait: (description) => {
          // /prompt:portrait "Asian woman, professional..."
          console.log('[Prompt] Domain: Portrait');
          return { domain: 'portrait', prompt: description };
        },
        
        crossDomain: (description, domains) => {
          // /prompt:cross-domain "city with people, cyberpunk..."
          console.log(`[Prompt] Cross-domain: ${domains.join(', ')}`);
          return { domain: 'cross-domain', domains, prompt: description };
        },
        
        design: (description) => {
          // /prompt:design "Apple-style clean design..."
          console.log('[Prompt] Domain: Design');
          return { domain: 'design', prompt: description };
        }
      }
    };
    
    console.log('[Prompt Generator] ✓ Loaded (prompt engineering)');
  }

  /**
   * UI/UX Pro Max + SkillX - Design system integration
   */
  async loadUIUXSkill() {
    const uiPath = path.join(this.config.skillsPath, 'ui-ux-pro-max-skill');
    const skillxPath = path.join(this.config.skillsPath, 'skillx');
    
    if (!fs.existsSync(uiPath) && !fs.existsSync(skillxPath)) {
      console.warn('[UI/UX] Skills not found');
      return;
    }
    
    this.skills.uiux = {
      paths: { ui: uiPath, skillx: skillxPath },
      status: 'loaded',
      methods: {
        getDesignTokens: () => {
          // Load design tokens for theming
          console.log('[UI/UX] Loading design tokens...');
          return { theme: 'default', tokens: {} };
        },
        
        mapComponentDesign: (designSpec) => {
          // Map design specs to component library
          console.log('[UI/UX] Mapping design to components...');
          return { designSpec, components: [] };
        }
      }
    };
    
    console.log('[UI/UX] ✓ Loaded (design system)');
  }

  /**
   * Orchestrate a complete workflow
   */
  async orchestrateWorkflow(taskType, requirements) {
    console.log(`\n[Orchestrator] Starting workflow: ${taskType}`);
    
    const taskId = `${taskType}-${Date.now()}`;
    const workflow = {
      taskId,
      type: taskType,
      startTime: new Date(),
      stages: []
    };
    
    try {
      // Stage 1: Planning
      if (this.skills.planning) {
        workflow.stages.push(
          this.skills.planning.methods.startPlanning(taskId, requirements)
        );
      }
      
      // Stage 2: Prompt Generation (if needed for clarification)
      if (this.skills.promptGenerator) {
        // Generate clarifying prompts for requirements
        workflow.stages.push(
          this.skills.promptGenerator.methods.portrait(requirements)
        );
      }
      
      // Stage 3: Superpowers Workflow
      if (this.skills.superpowers) {
        const spec = this.skills.superpowers.methods.spec(requirements);
        const plan = this.skills.superpowers.methods.plan(spec);
        workflow.stages.push(spec, plan);
      }
      
      // Stage 4: Subagent Dispatch
      if (this.skills.subagents) {
        workflow.stages.push(
          this.skills.subagents.methods.dispatch('voltagent-lang-python', { taskId })
        );
      }
      
      // Stage 5: Review
      if (this.skills.superpowers) {
        workflow.stages.push(
          this.skills.superpowers.methods.review({ taskId })
        );
      }
      
      workflow.status = 'completed';
      this.tasks.set(taskId, workflow);
      
      console.log(`[Orchestrator] Workflow completed: ${taskId}\n`);
      return workflow;
      
    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      console.error(`[Orchestrator] Workflow failed:`, error.message);
      return workflow;
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(taskId) {
    return this.tasks.get(taskId) || null;
  }

  /**
   * List all active workflows
   */
  listWorkflows() {
    return Array.from(this.tasks.values());
  }
}

// Export for use in other modules
module.exports = JamalOrchestrator;

// Example usage (uncomment to test)
/*
(async () => {
  const orchestrator = new JamalOrchestrator({
    skillsPath: '/data/.openclaw/workspace/skills'
  });
  
  await orchestrator.initialize();
  
  const workflow = await orchestrator.orchestrateWorkflow(
    'build-python-cli',
    'Create a Python CLI tool for file management with async support'
  );
  
  console.log('\nWorkflow Result:', JSON.stringify(workflow, null, 2));
})();
*/
