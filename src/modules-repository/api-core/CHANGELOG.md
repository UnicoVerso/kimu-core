# API Core Module - Changelog

## [1.0.0] - 2025-11-01

### Added
- Initial release of API Core module
- Basic HTTP client functionality based on native fetch API
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Request/Response/Error interceptors
- Query parameters and headers management
- Timeout and request cancellation support
- Multiple response types (JSON, text, blob, arraybuffer)
- Global configuration with baseURL
- TypeScript-first with complete type safety
- Zero external dependencies (~2KB minified)
- Comprehensive documentation and examples

### Features
- ✅ Promise-based async/await API
- ✅ Automatic JSON parsing
- ✅ Error handling with structured ApiError
- ✅ Request/Response transformation via interceptors
- ✅ Configurable timeout
- ✅ AbortController support for request cancellation
- ✅ Query parameters serialization
- ✅ Custom headers support
- ✅ Credentials and cache mode configuration
- ✅ Lightweight and performant

### Documentation
- Complete README with usage examples
- TypeScript interfaces and type definitions
- Example file with 17+ practical use cases
- Integration examples with KIMU components

### Future Roadmap
- Automatic retry logic
- Request caching
- Request deduplication
- Upload/Download progress tracking
- Request queue with priority
- Mock/test utilities
