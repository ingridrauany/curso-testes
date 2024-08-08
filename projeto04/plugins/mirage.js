if (process.env.NODE_ENV === 'development') {
  require('@/miragejs/server').makeServer()
}

if (typeof window !== 'undefined' && window.Cypress) {
  const server = require('@/miragejs/server').makeServer({
    environment: 'test',
  })

  window.Cypress.on('window:before:load', (win) => {
    win.handleFromCypress = (req) => {
      const mirageRequest = server.pretender.handledRequest(
        req.url,
        req.method.toLowerCase(),
        req.requestBody,
        req.requestHeaders
      )

      const mirageResponse = mirageRequest.response
      return new Promise((resolve) =>
        resolve([
          mirageResponse.code,
          mirageResponse.headers.getAllHeaders(),
          mirageResponse.data,
        ])
      )
    }
  })
}
