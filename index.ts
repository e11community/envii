#!/usr/bin/env node

import {execFileSync} from 'child_process'
import {parse} from 'dotenv'
import {existsSync, readFileSync} from 'fs'
import merge from 'lodash.merge'

const args = process.argv.slice(2)
const commandArray: string[] = []
let mergedEnvironment = {}
let envPath = 'env/env.local'
let capturing = false

for (const arg of args) {
  if (capturing) {
    commandArray.push(arg)
  } else {
    if (arg === '--') {
      capturing = true
    } else if (arg.startsWith('--env=')) {
      envPath = `env/env.${arg.substring('--env='.length)}`
    } else {
      capturing = true
      commandArray.push(arg)
    }
  }
}


if (existsSync(envPath)) {
  const contentsBuffer = readFileSync(envPath)
  const contentEnvironment = parse(contentsBuffer)
  mergedEnvironment = merge(mergedEnvironment, contentEnvironment)
}

const commandFile = commandArray[0]
const commandArgs = commandArray.slice(1)
mergedEnvironment = merge(mergedEnvironment, process.env)
execFileSync(commandFile, commandArgs, { env: mergedEnvironment, stdio: 'inherit'})
