# Changelog - API Axios Module

All notable changes to the api-axios module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-01

### Added
- Initial release of api-axios module
- Full Axios-based HTTP client implementation
- Request/response interceptors support
- Automatic retry logic with exponential backoff
- Request cancellation support via cancel tokens
- Upload/download progress tracking
- Response caching with configurable TTL
- Complete TypeScript type definitions
- Comprehensive documentation and examples
- Migration guide from api-core
- Error transformation and standardized error handling
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Query parameters and custom headers support
- Timeout configuration per request
- Credentials (cookies) support

### Features Over api-core
- **Interceptors**: Add custom logic before/after requests
- **Retry Logic**: Automatic retry with exponential backoff
- **Cancellation**: Cancel pending requests when needed
- **Progress**: Track upload/download progress in real-time
- **Caching**: Cache GET responses to reduce network calls
- **Better Errors**: Enhanced error handling with original error preservation

### Dependencies
- axios: ^1.6.0 (external dependency)

## [Unreleased]

### Planned Features
- Request deduplication (prevent duplicate concurrent requests)
- Request queue management
- Offline request queueing
- Custom retry strategies
- Response schema validation
- Mock mode for testing
- Request/response logging
- Metrics and performance tracking
