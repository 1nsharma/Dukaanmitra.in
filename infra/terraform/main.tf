# ==============================================================================
# DukaanMitra Infrastructure as Code (IaC) — Google Cloud Platform
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

variable "gcp_project_id" {
  type    = string
  default = "dukaanmitra-in"
}

variable "gcp_region" {
  type    = string
  default = "asia-south1" # Mumbai, India for ultra-low latency to Bharat MSMEs
}

# 1. Cloud SQL Managed PostgreSQL Instance
resource "google_sql_database_instance" "dukaanmitra_postgres" {
  name             = "dukaanmitra-prod-db"
  database_version = "POSTGRES_15"
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

# 2. Serverless Cloud Run for FastAPI Superintelligence
resource "google_cloud_run_v2_service" "ai_services" {
  name     = "dukaanmitra-ai-engine"
  location = var.gcp_region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.gcp_project_id}/ai-services:latest"
      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }
      env {
        name  = "DUKAANMITRA_ENV"
        value = "production"
      }
    }
  }
}
