export interface BookProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly publishedYear: number;
  readonly isAvailable: boolean;
}

export class Book {
  private readonly props: BookProps;

  constructor(props: BookProps) {
    this.validateProps(props);
    this.props = { ...props };
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get author(): string {
    return this.props.author;
  }

  get isbn(): string {
    return this.props.isbn;
  }

  get publishedYear(): number {
    return this.props.publishedYear;
  }

  get isAvailable(): boolean {
    return this.props.isAvailable;
  }

  public markAsLent(): Book {
    if (!this.isAvailable) {
      throw new Error('Book is already lent');
    }

    return new Book({
      ...this.props,
      isAvailable: false,
    });
  }

  public markAsReturned(): Book {
    if (this.isAvailable) {
      throw new Error('Book is already available');
    }

    return new Book({
      ...this.props,
      isAvailable: true,
    });
  }

  private validateProps(props: BookProps): void {
    if (!props.title.trim()) {
      throw new Error('Book title cannot be empty');
    }
    if (!props.author.trim()) {
      throw new Error('Book author cannot be empty');
    }
    if (!props.isbn.trim()) {
      throw new Error('Book ISBN cannot be empty');
    }
    if (props.publishedYear < 1000 || props.publishedYear > new Date().getFullYear()) {
      throw new Error('Invalid published year');
    }
  }
}
