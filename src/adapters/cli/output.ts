// CLI Output Formatter
export type OutputFormat = 'text' | 'json' | 'table';

export interface OutputOptions {
  format?: OutputFormat;
  color?: boolean;
  verbose?: boolean;
}

export class OutputFormatter {
  format(data: unknown, options: OutputOptions = {}): string {
    const { format = 'text', color = true } = options;

    switch (format) {
      case 'json':
        return this.formatJson(data);
      case 'table':
        return this.formatTable(data as Record<string, unknown>[]);
      case 'text':
      default:
        return this.formatText(data, color);
    }
  }

  private formatJson(data: unknown): string {
    return JSON.stringify(data, null, 2);
  }

  private formatText(data: unknown, color: boolean): string {
    if (typeof data === 'string') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.formatText(item, color)).join('\n');
    }

    if (typeof data === 'object' && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }

    return String(data);
  }

  private formatTable(data: Record<string, unknown>[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const widths = headers.map((h) =>
      Math.max(h.length, ...data.map((row) => String(row[h] || '').length))
    );

    const headerRow = headers
      .map((h, i) => h.padEnd(widths[i]))
      .join(' | ');

    const separator = widths.map((w) => '-'.repeat(w)).join('-+-');

    const rows = data.map((row) =>
      headers
        .map((h, i) => String(row[h] || '').padEnd(widths[i]))
        .join(' | ')
    );

    return [headerRow, separator, ...rows].join('\n');
  }

  success(message: string): string {
    return `\x1b[32m✓ ${message}\x1b[0m`;
  }

  error(message: string): string {
    return `\x1b[31m✗ ${message}\x1b[0m`;
  }

  warning(message: string): string {
    return `\x1b[33m⚠ ${message}\x1b[0m`;
  }

  info(message: string): string {
    return `\x1b[36mℹ ${message}\x1b[0m`;
  }
}

export const outputFormatter = new OutputFormatter();
