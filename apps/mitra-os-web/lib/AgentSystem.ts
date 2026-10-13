type AgentType = "Billing" | "Khata" | "API" | "Wobbanate";
type TaskType = "Invoice" | "Reminder" | "Sync" | "Predict";

export interface MiniAgent {
  id: string;
  type: TaskType;
  parentAgentId: string;
  position: [number, number, number];
  color: string;
  task: () => void;
}

export interface MainAgent {
  id: string;
  type: AgentType;
  team: string;
  miniAgents: MiniAgent[];
  position: [number, number, number];
  color: string;
  currentTask: TaskType | null;
}

export interface HumanUser {
  id: string;
  name: string;
  store: string;
  avatar: string;
  tasks: TaskType[];
}

export class AgentSociety {
  private agents: MainAgent[] = [];
  private humans: HumanUser[] = [];
  private wobjo: number = 0;

  constructor() {
    this.initializeAgents();
    this.initializeHumans();
  }

  private initializeAgents() {
    // Billing Team
    this.agents.push({
      id: "billing-1",
      type: "Billing",
      team: "Billing Agents",
      miniAgents: [
        {
          id: "mini-invoice-1",
          type: "Invoice",
          parentAgentId: "billing-1",
          position: [0, 0, 0],
          color: "#3b82f6",
          task: () => this.generateWobjo(10),
        },
        {
          id: "mini-receipt-1",
          type: "Reminder",
          parentAgentId: "billing-1",
          position: [0, 0, 0],
          color: "#3b82f6",
          task: () => this.generateWobjo(5),
        },
      ],
      position: [0, 0, -5],
      color: "#3b82f6",
      currentTask: null,
    });

    // Khata Team
    this.agents.push({
      id: "khata-1",
      type: "Khata",
      team: "Khata Agents",
      miniAgents: [
        {
          id: "mini-reminder-1",
          type: "Reminder",
          parentAgentId: "khata-1",
          position: [0, 0, 0],
          color: "#10b981",
          task: () => this.generateWobjo(15),
        },
      ],
      position: [0, 0, -15],
      color: "#10b981",
      currentTask: null,
    });

    // Wobbanate Core
    this.agents.push({
      id: "wobbanate-1",
      type: "Wobbanate",
      team: "AI Core",
      miniAgents: [],
      position: [0, 0, -25],
      color: "#f59e0b",
      currentTask: null,
    });
  }

  private initializeHumans() {
    this.humans.push({
      id: "human-1",
      name: "Rajesh (Kanpur)",
      store: "Rajesh Kirana",
      avatar: "/models/shopkeeper.glb",
      tasks: ["Invoice", "Reminder"],
    });
  }

  public generateWobjo(amount: number) {
    this.wobjo += amount;
  }

  public getAgents(): MainAgent[] {
    return this.agents;
  }

  public getHumans(): HumanUser[] {
    return this.humans;
  }

  public getWobjo(): number {
    return this.wobjo;
  }
}
