#!/usr/bin/env node
/**
 * Idempotent label seeding script for GitHub repository aya-mash/customer-spending-insights-dashboard.
 * Requirements: GitHub CLI (gh), Node.js >= 18.
 * Usage: node scripts/seed-labels.mjs OR make executable and run directly.
 */

import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import https from 'node:https'
import { URL } from 'node:url'

// Allow auto-detect of repo from git remote if available; fallback to explicit constant
let REPO = 'aya-mash/customer-spending-insights-dashboard'
try {
  const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
  // remote could be git@github.com:owner/repo.git or https URL
  const match = remote.match(/github\.com[/:]([\w.-]+)\/(.+?)\.git$/)
  if (match) {
    REPO = `${match[1]}/${match[2]}`
  }
} catch { /* ignore */ }

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const VERBOSE = args.has('--verbose')

function fail(msg) {
  console.error(`ERROR: ${msg}`)
  process.exit(1)
}

function hasGhCli() {
  try {
    execSync('gh --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

if (!hasGhCli()) {
  fail('GitHub CLI (gh) is not installed. See https://cli.github.com/')
}

// Ensure auth
try {
  execSync('gh auth status', { stdio: 'ignore' })
} catch {
  fail('GitHub CLI is not authenticated. Run: gh auth login')
}

// Load labels definition
let labels
try {
  const raw = readFileSync(new URL('../labels.json', import.meta.url), 'utf-8')
  labels = JSON.parse(raw)
  if (!Array.isArray(labels)) fail('labels.json must be an array')
} catch (e) {
  fail('Unable to read labels.json: ' + e.message)
}

function getAuthToken() {
  try {
    return execSync('gh auth token', { encoding: 'utf-8' }).trim()
  } catch {
    fail('Unable to retrieve auth token from gh. Ensure you ran: gh auth login')
  }
}

const TOKEN = getAuthToken()

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com${path}`)
    const data = body ? JSON.stringify(body) : undefined
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'label-seeder-script',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0,
      },
    }
    const req = https.request(url, opts, res => {
      let chunks = ''
      res.on('data', c => { chunks += c })
      res.on('end', () => {
        const isJson = res.headers['content-type']?.includes('application/json')
        const parsed = isJson && chunks ? JSON.parse(chunks) : chunks
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed)
        } else {
          const err = new Error(`HTTP ${res.statusCode}: ${typeof parsed === 'string' ? parsed : parsed?.message}`)
          err.statusCode = res.statusCode
          err.body = parsed
          reject(err)
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function getLabel(name) {
  try {
    return await request('GET', `/repos/${REPO}/labels/${encodeURIComponent(name)}`)
  } catch (e) {
    if (e.statusCode === 404) return null
    if (VERBOSE) console.error(`Lookup error for ${name}:`, e.message)
    return null
  }
}

function isValid(label) {
  return label && label.name && label.color && label.description
}

function needsUpdate(existing, desired) {
  return existing.color.toLowerCase() !== desired.color.toLowerCase() || (existing.description || '') !== desired.description
}

async function createLabel({ name, color, description }) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would create label: ${name}`)
    return
  }
  try {
    await request('POST', `/repos/${REPO}/labels`, { name, color, description })
    console.log(`Created label: ${name}`)
  } catch (e) {
    console.error(`Failed to create label ${name} :: ${e.message}`)
    if (VERBOSE && e.body) console.error('Response body:', e.body)
  }
}

async function updateLabel({ name, color, description }) {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would update label: ${name}`)
    return
  }
  try {
    await request('PATCH', `/repos/${REPO}/labels/${encodeURIComponent(name)}`, { name, color, description })
    console.log(`Updated label: ${name}`)
  } catch (e) {
    console.error(`Failed to update label ${name} :: ${e.message}`)
    if (VERBOSE && e.body) console.error('Response body:', e.body)
  }
}

console.log(`Seeding labels for repo: ${REPO}${DRY_RUN ? ' (dry-run)' : ''}`)
for (const label of labels) {
  if (!isValid(label)) {
    console.warn(`Skipping invalid label entry: ${JSON.stringify(label)}`)
    continue
  }
  const existing = await getLabel(label.name)
  if (!existing) {
    await createLabel(label)
    continue
  }
  if (!needsUpdate(existing, label)) {
    console.log(`No change needed: ${label.name}`)
    continue
  }
  await updateLabel(label)
}
console.log('Label seeding complete.')
if (DRY_RUN) console.log('Dry-run performed. Re-run without --dry-run to apply changes.')

console.log('Label seeding complete.')
