# DATA.md — DecaShift Data Schemas & Sample Content

> **Purpose:** Feed this file to AI when generating `questions.json`, `goals.json`, or when extending the question bank.

---

## goals.json — Full Schema

```json
[
  {
    "id": "string — kebab-case unique ID",
    "name": "string — display name",
    "description": "string — one-line what this goal covers",
    "tags": ["array of strings"],
    "questionCount": "number — auto-calculated, optional",
    "createdAt": "ISO date string"
  }
]
```

### Sample goals.json
```json
[
  {
    "id": "azure-aks",
    "name": "Azure AKS Deep Dive",
    "description": "AKS architecture, networking, workload identity, scaling, security",
    "tags": ["azure", "kubernetes", "cloud", "devops"],
    "createdAt": "2024-01-01"
  },
  {
    "id": "mlops-banking",
    "name": "MLOps for Banking (OSFI E-23)",
    "description": "ML pipelines, model governance, drift detection, Azure ML, compliance",
    "tags": ["mlops", "azure", "banking", "compliance"],
    "createdAt": "2024-01-01"
  },
  {
    "id": "terraform-azure",
    "name": "Terraform on Azure",
    "description": "IaC patterns, state management, modules, CI/CD integration",
    "tags": ["terraform", "azure", "iac", "devops"],
    "createdAt": "2024-01-01"
  }
]
```

---

## questions.json — Full Schema

```json
[
  {
    "id": "string — unique e.g. q001",
    "goalId": "string — must match a goal id",
    "question": "string — the question text",
    "options": ["array", "of", "4", "strings"],
    "correctIndex": "number — 0-3, index into options array",
    "explanation": "string — shown after answer submitted (optional but recommended)",
    "difficulty": "easy | medium | hard",
    "tags": ["optional", "sub-topic", "tags"]
  }
]
```

### Sample questions.json (5 questions per goal = 15 total)

```json
[
  {
    "id": "aks-001",
    "goalId": "azure-aks",
    "question": "What is the primary role of Workload Identity in AKS?",
    "options": [
      "Federate pod identity with Azure AD via OIDC without storing credentials",
      "Store Kubernetes secrets in Azure Key Vault automatically",
      "Enable network policy enforcement between pods",
      "Provide RBAC for the Kubernetes API server"
    ],
    "correctIndex": 0,
    "explanation": "Workload Identity replaces AAD Pod Identity by using OIDC token federation. Pods get a projected service account token that Azure AD trusts, so no client secrets or managed identity assignments on nodes are needed.",
    "difficulty": "medium",
    "tags": ["identity", "security", "oidc"]
  },
  {
    "id": "aks-002",
    "goalId": "azure-aks",
    "question": "AKS has two system-assigned managed identities. Which two are they?",
    "options": [
      "Control plane identity and kubelet identity (node pool identity)",
      "API server identity and etcd identity",
      "Ingress identity and CNI identity",
      "Cluster identity and pod identity"
    ],
    "correctIndex": 0,
    "explanation": "AKS creates: (1) a control plane managed identity used by the AKS resource provider to manage cluster infrastructure, and (2) a kubelet managed identity used by each node pool to pull images from ACR and interact with Azure APIs.",
    "difficulty": "hard",
    "tags": ["identity", "architecture"]
  },
  {
    "id": "aks-003",
    "goalId": "azure-aks",
    "question": "Which AKS feature allows you to run pods on Azure Container Instances for burst scaling without provisioning new nodes?",
    "options": [
      "Virtual Nodes (ACI connector)",
      "Cluster Autoscaler",
      "Horizontal Pod Autoscaler",
      "KEDA"
    ],
    "correctIndex": 0,
    "explanation": "Virtual Nodes use the ACI connector (based on Virtual Kubelet) to schedule pods directly onto Azure Container Instances. This enables near-instant burst capacity without waiting for VM node provisioning.",
    "difficulty": "medium",
    "tags": ["scaling", "aci"]
  },
  {
    "id": "aks-004",
    "goalId": "azure-aks",
    "question": "What does ACR stand for in the Azure ecosystem and how does it relate to AKS?",
    "options": [
      "Azure Container Registry — stores Docker images pulled by AKS nodes",
      "Azure Cluster Router — routes traffic between AKS pods",
      "Azure Core Runtime — the container runtime used by AKS",
      "Azure Control Resource — manages AKS resource quotas"
    ],
    "correctIndex": 0,
    "explanation": "ACR = Azure Container Registry. AKS node pools use the kubelet managed identity to authenticate with ACR and pull container images. You attach ACR to AKS via `az aks update --attach-acr`.",
    "difficulty": "easy",
    "tags": ["acr", "images", "basics"]
  },
  {
    "id": "aks-005",
    "goalId": "azure-aks",
    "question": "In a banking AKS deployment, which network plugin supports network policies AND provides better performance for pod-to-pod traffic?",
    "options": [
      "Azure CNI with Cilium",
      "Kubenet with Calico",
      "Flannel with iptables",
      "Weave Net"
    ],
    "correctIndex": 0,
    "explanation": "Azure CNI assigns real VNet IPs to pods (no NAT overhead). Combined with Cilium as the network policy engine, it provides eBPF-based enforcement which outperforms iptables-based solutions like Calico for high-throughput banking workloads.",
    "difficulty": "hard",
    "tags": ["networking", "cni", "security"]
  },
  {
    "id": "mlops-001",
    "goalId": "mlops-banking",
    "question": "Under OSFI E-23, what is required before a bank deploys an ML model into production?",
    "options": [
      "Model risk assessment, validation by an independent team, documented governance, and ongoing monitoring",
      "Only unit tests and a code review by the data science team",
      "A performance benchmark showing >80% accuracy on test data",
      "Sign-off from the CTO and a 30-day freeze period"
    ],
    "correctIndex": 0,
    "explanation": "OSFI E-23 (Model Risk Management guideline) requires: (1) independent model validation, (2) documented model inventory, (3) risk tiering of models, (4) ongoing monitoring for drift and performance degradation, and (5) clear ownership and governance.",
    "difficulty": "hard",
    "tags": ["compliance", "governance", "osfi"]
  },
  {
    "id": "mlops-002",
    "goalId": "mlops-banking",
    "question": "What Azure service is the primary hub for MLOps pipelines, experiment tracking, and model registry?",
    "options": [
      "Azure Machine Learning (Azure ML / AML)",
      "Azure Databricks",
      "Azure Synapse Analytics",
      "Azure AI Foundry"
    ],
    "correctIndex": 0,
    "explanation": "Azure ML is the end-to-end MLOps platform: it provides pipelines, experiment tracking, model registry with versioning, managed endpoints for deployment, and integrations with AKS for inference. Azure AI Foundry is for GenAI/LLM workflows.",
    "difficulty": "easy",
    "tags": ["azure-ml", "platform"]
  },
  {
    "id": "mlops-003",
    "goalId": "mlops-banking",
    "question": "What is data drift in an ML context and which Azure ML feature detects it?",
    "options": [
      "Statistical shift in input data distribution over time — detected by Azure ML Data Drift Monitor",
      "Corruption of training data files in Azure Blob Storage",
      "Network latency causing slow model inference responses",
      "Version mismatch between model training and serving environments"
    ],
    "correctIndex": 0,
    "explanation": "Data drift occurs when the statistical properties of production data diverge from training data, degrading model performance. Azure ML's Dataset Monitor computes drift metrics (Jensen-Shannon divergence, Wasserstein distance) on a schedule and alerts when thresholds are breached.",
    "difficulty": "medium",
    "tags": ["drift", "monitoring"]
  },
  {
    "id": "mlops-004",
    "goalId": "mlops-banking",
    "question": "Which open-source tool is most commonly used for feature store management in an AKS-based MLOps stack?",
    "options": [
      "Feast",
      "MLflow",
      "Kubeflow",
      "DVC"
    ],
    "correctIndex": 0,
    "explanation": "Feast (Feature Store) manages feature definitions, point-in-time correct training data retrieval, and online feature serving. MLflow handles experiment tracking and model registry. Kubeflow orchestrates ML pipelines on Kubernetes. DVC handles data versioning.",
    "difficulty": "medium",
    "tags": ["feature-store", "feast"]
  },
  {
    "id": "mlops-005",
    "goalId": "mlops-banking",
    "question": "What is the difference between model retraining and model fine-tuning in an MLOps context?",
    "options": [
      "Retraining rebuilds the model from scratch on new data; fine-tuning updates weights of a pre-trained model on domain-specific data",
      "Retraining is for deep learning; fine-tuning is for classical ML",
      "Retraining requires new features; fine-tuning uses the same features",
      "There is no difference — the terms are interchangeable"
    ],
    "correctIndex": 0,
    "explanation": "Retraining: full training loop from scratch (or from checkpoint) on updated/expanded dataset — used when distribution shifts significantly. Fine-tuning: start from a pre-trained model, run a shorter training pass on target domain data — common for LLMs and transfer learning scenarios.",
    "difficulty": "medium",
    "tags": ["training", "concepts"]
  },
  {
    "id": "tf-001",
    "goalId": "terraform-azure",
    "question": "Where should Terraform remote state be stored for a production Azure deployment?",
    "options": [
      "Azure Blob Storage with state locking via Azure Blob lease",
      "Local filesystem committed to the Git repository",
      "Azure SQL Database",
      "Azure Key Vault"
    ],
    "correctIndex": 0,
    "explanation": "Azure Blob Storage backend (`azurerm` backend) stores `.tfstate` remotely and uses Azure Blob Storage leases for state locking to prevent concurrent apply operations. Never commit `.tfstate` to Git — it contains sensitive data.",
    "difficulty": "easy",
    "tags": ["state", "backend"]
  },
  {
    "id": "tf-002",
    "goalId": "terraform-azure",
    "question": "What is the purpose of `terraform plan -out=tfplan` in a CI/CD pipeline?",
    "options": [
      "Save the execution plan to a file so `terraform apply` runs the exact same plan without re-evaluating",
      "Preview changes without saving anything",
      "Lock the state file before applying",
      "Generate a cost estimate for the planned changes"
    ],
    "correctIndex": 0,
    "explanation": "Saving the plan with `-out=tfplan` guarantees that what was reviewed in the PR (the plan output) is exactly what gets applied — no drift between plan and apply steps. This is a CI/CD best practice for predictable infrastructure changes.",
    "difficulty": "medium",
    "tags": ["cicd", "plan"]
  },
  {
    "id": "tf-003",
    "goalId": "terraform-azure",
    "question": "What does `terraform import` do and when would you use it?",
    "options": [
      "Brings existing Azure resources under Terraform management without recreating them",
      "Downloads provider plugins from the Terraform registry",
      "Imports variables from a .tfvars file",
      "Copies modules from a remote module registry"
    ],
    "correctIndex": 0,
    "explanation": "`terraform import <resource_type.name> <azure_resource_id>` associates an existing Azure resource with a Terraform resource block. Used when you have infrastructure created manually or by another tool that you want to manage with Terraform going forward.",
    "difficulty": "medium",
    "tags": ["import", "migration"]
  },
  {
    "id": "tf-004",
    "goalId": "terraform-azure",
    "question": "What is the recommended way to authenticate Terraform to Azure in a GitHub Actions pipeline?",
    "options": [
      "OIDC federated identity (Workload Identity) — no client secrets stored in GitHub",
      "Service principal with client secret stored in GitHub Secrets",
      "Azure CLI login with username/password",
      "Managed Identity on a self-hosted runner"
    ],
    "correctIndex": 0,
    "explanation": "GitHub Actions OIDC + Azure Workload Identity Federation is the modern best practice. GitHub issues a short-lived OIDC token; Azure AD trusts it via a federated credential. No secrets stored anywhere — eliminates rotation burden and secret leak risk.",
    "difficulty": "hard",
    "tags": ["auth", "cicd", "oidc", "security"]
  },
  {
    "id": "tf-005",
    "goalId": "terraform-azure",
    "question": "What is a Terraform module and what problem does it solve?",
    "options": [
      "A reusable, parameterized collection of resources — solves code duplication and enforces standards across environments",
      "A plugin that extends Terraform with new resource types",
      "A way to split state files across multiple backends",
      "A testing framework for infrastructure code"
    ],
    "correctIndex": 0,
    "explanation": "Modules package related resources (e.g., an AKS cluster module with networking, identity, node pools) into a single reusable unit with input variables and outputs. Teams use modules to enforce architecture standards and reduce copy-paste across dev/staging/prod.",
    "difficulty": "easy",
    "tags": ["modules", "reuse"]
  }
]
```

---

## How to Generate More Questions (AI Prompt Template)

Paste this prompt into Claude/ChatGPT to generate more questions:

```
Generate 10 questions for the DecaShift quiz app in this exact JSON format:

{
  "id": "unique-id",
  "goalId": "TARGET_GOAL_ID",
  "question": "question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "explanation": "detailed explanation of why the answer is correct and why others are wrong",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2"]
}

Topic: [YOUR TOPIC HERE e.g. "Azure AKS networking and security for banking"]
goalId: [e.g. "azure-aks"]
Focus on scenario-based questions that would appear in a senior architect interview.
Mix of easy (20%), medium (50%), hard (30%).
Return only valid JSON array, no markdown.
```

---

*Feed this file to AI alongside CLAUDE.md when generating or extending the question bank.*
