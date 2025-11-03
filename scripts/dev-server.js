#!/usr/bin/env node

import { createServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, '..')

// Enhanced logging functions
const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  warning: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  server: (msg) => console.log(chalk.magenta('🚀'), msg)
}

async function startDevServer() {
  try {
    log.info('Initializing development server...')
    
    // Create Vite server
    const server = await createServer({
      root,
      configFile: resolve(root, 'vite.config.js'),
      server: {
        host: 'localhost',
        port: process.env.PORT || 3000,
        open: true,
        strictPort: false
      }
    })

    // Start the server
    await server.listen()
    
    const info = server.config.server
    const protocol = info.https ? 'https' : 'http'
    const host = info.host || 'localhost'
    const port = info.port || 3000
    
    // Display startup messages
    console.log('\n' + chalk.cyan('🎯 PitchCraft Development Server'))
    console.log(chalk.gray('━'.repeat(50)))
    
    log.success('Server successfully initialized!')
    log.server(`Local:   ${protocol}://${host}:${port}`)
    log.server(`Network: ${protocol}://localhost:${port}`)
    
    console.log('\n' + chalk.gray('📁 Static files served from: ./public'))
    console.log(chalk.gray('🔄 Hot Module Replacement (HMR) enabled'))
    console.log(chalk.gray('👀 Watching for file changes...'))
    
    console.log('\n' + chalk.yellow('Press Ctrl+C to stop the server'))
    console.log(chalk.gray('━'.repeat(50)) + '\n')

    // Handle server errors
    server.ws.on('error', (err) => {
      log.error(`WebSocket error: ${err.message}`)
    })

    // Handle process termination
    process.on('SIGTERM', () => {
      log.info('Received SIGTERM, shutting down gracefully...')
      server.close()
      process.exit(0)
    })

    process.on('SIGINT', () => {
      log.info('\nReceived SIGINT, shutting down gracefully...')
      server.close()
      process.exit(0)
    })

  } catch (error) {
    log.error('Failed to start development server:')
    console.error(error)
    
    if (error.code === 'EADDRINUSE') {
      log.warning(`Port ${process.env.PORT || 3000} is already in use.`)
      log.info('Trying to find an available port...')
    }
    
    process.exit(1)
  }
}

// Start the server
startDevServer()