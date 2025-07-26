# Contributing to CloudyBox

First off, thank you for considering contributing to CloudyBox! 🎉

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Ways to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/repostlyio/CloudyBox/issues) as you might find out that you don't need to create one.

When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots or animated GIFs** which show you following the described steps
- **Include details about your configuration and environment**

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior** and **explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful** to most CloudyBox users

### 🔧 Code Contributions

#### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/CloudyBox.git
   cd CloudyBox
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your test S3 credentials
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

#### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Run linting:
   ```bash
   npm run lint
   ```
5. Commit your changes with clear, descriptive messages
6. Push to your fork and create a pull request

#### Pull Request Guidelines

- **Fill in the required template**
- **Include screenshots or GIFs** for UI changes
- **Include tests** when adding new functionality
- **Reference issues and pull requests** liberally after the first line
- **Follow the existing code style**
- **End all files with a newline**

### 🎨 Design Contributions

We welcome design improvements and suggestions! Please include:

- **Mockups or wireframes** for proposed changes
- **Rationale** for design decisions
- **Consider accessibility** in your designs
- **Follow modern UI/UX principles**

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

### Architecture

CloudyBox follows these principles:

- **Clean Architecture** - Separation of concerns
- **Component-based** - Reusable UI components
- **Type Safety** - TypeScript throughout
- **Modern React** - Hooks and functional components
- **Responsive Design** - Mobile-first approach

### Testing

- Test new features and bug fixes
- Include edge cases in testing
- Test with different S3 providers when possible
- Verify responsive design on different screen sizes

### Documentation

- Update README.md for new features
- Include JSDoc comments for complex functions
- Update type definitions when needed
- Add examples for new functionality

## Recognition

Contributors who make significant contributions will be recognized in the project's README and potentially invited to become maintainers.

## Getting Help

If you need help with contributing:

- Check the [documentation](README.md)
- Ask questions in [GitHub Discussions](https://github.com/repostlyio/CloudyBox/discussions)
- Create an issue with the "question" label

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

Thank you for contributing to CloudyBox! 🌤️