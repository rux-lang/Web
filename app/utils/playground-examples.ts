import type { PlaygroundExample } from "~/types/playground";

/**
 * The playground's starter gallery.
 *
 * Ported from the `rux-lang/Examples` repository so the programs a reader meets
 * here are the ones the docs and the repository already teach, with tabs
 * normalised to the editor's four-space indent unit. `String.raw` keeps the
 * escapes in the Rux source escapes rather than turning `\n` into a newline on
 * the way into the buffer.
 *
 * Icon names live in this `.ts` file, and Nuxt Icon's scanner only globs
 * `.vue`/`.md`/`.yml` — each one is pinned in `nuxt.config.ts` under
 * `icon.clientBundle.icons` or it renders as a blank gap after prerender.
 */
export const playgroundExamples: PlaygroundExample[] = [
  {
    value: "hello",
    label: "Hello",
    icon: "i-lucide-terminal",
    description: "The smallest program.",
    stdin: "",
    source: String.raw`import Io::Print;

func Main() -> int {
    Print("Hello, World!\n");
    return 0;
}
`,
  },
  {
    value: "greeting",
    label: "Greeting",
    icon: "i-lucide-languages",
    description: "An array of strings in a loop.",
    stdin: "",
    source: String.raw`import Io::PrintLine;

// Entry point of the program
func Main() -> int {
    let greetings = [
        "Hello World",
        "你好，世界",
        "नमस्ते दुनिया",
        "Hola Mundo",
        "Bonjour le monde",
        "مرحبا يا عالم",
        "হ্যালো বিশ্ব",
        "Привет мир",
        "Olá Mundo",
        "سلام دنیا",
        "Привіт світ",
        "🐯🐶🐱🐭"
    ];
    for greeting in greetings {
        PrintLine(greeting);
    }
    return 0;
}
`,
  },
  {
    value: "primitive",
    label: "Primitive types",
    icon: "i-lucide-binary",
    description: "Every built-in numeric width.",
    stdin: "",
    source: String.raw`import Io::PrintLine;

func Main() -> int {
    let val1: int8 = 127;
    let val2: int16 = 32767;
    let val3: int32 = 2147483647;
    let val4: int64 = 9223372036854775807;
    let val5: int = -1000;

    let val6: uint8 = 255;
    let val7: uint16 = 65535;
    let val8: uint32 = 4294967295;
    let val9: uint64 = 18446744073709551615;
    let val10: uint = 1000;

    let val11: float32 = 3.4028235e+20f32;
    let val12: float64 = 1.7976931348623157e+200;
    let val13: float = 2.718281828459045;

    let val14: bool8 = true;
    let val15: bool16 = false;
    let val16: bool32 = true;
    let val17: bool = false;

    let val18: char8 = c8'W';
    let val19: char16 = c16'Я';
    let val20: char32 = c32'π';
    let val21: char = 'Ψ';

    PrintLine(val1);
    PrintLine(val2);
    PrintLine(val3);
    PrintLine(val4);
    PrintLine(val5);
    PrintLine(val6);
    PrintLine(val7);
    PrintLine(val8);
    PrintLine(val9);
    PrintLine(val10);
    PrintLine(val11);
    PrintLine(val12);
    PrintLine(val13);
    PrintLine(val14);
    PrintLine(val15);
    PrintLine(val16);
    PrintLine(val17);
    PrintLine(val18);
    PrintLine(val19);
    PrintLine(val20);
    PrintLine(val21);
    return 0;
}
`,
  },
  {
    value: "factorial",
    label: "Factorial",
    icon: "i-lucide-sigma",
    description: "An inclusive range and a product.",
    stdin: "",
    source: String.raw`import Io::PrintLine;

func Main() -> int {
    PrintLine("Factorial calculation");
    let n = 10;
    var result = 1;
    for i in 1..=n {
        result *= i;
        PrintLine("{}! = {}", i, result);
    }
    return 0;
}
`,
  },
  {
    value: "array",
    label: "Dynamic array",
    icon: "i-lucide-brackets",
    description: "Allocate, index, and free memory.",
    stdin: "",
    source: String.raw`import Memory::{ Alloc, Free, Zero };
import Io::{ Print, PrintLine };

func Main() -> int {
    PrintLine("Dynamic array");
    let count: uint = 16;
    let size = count * sizeof(uint);
    var ptr = Alloc(size) as *uint;
    if (ptr == null) {
        PrintLine("Failed to allocate memory");
        return 1;
    }
    PrintLine("Allocated memory {} bytes at address {}", size, ptr as uint);
    Zero(ptr, size);
    for i in 0..count {
        Print("{}; ", ptr[i]);
    }
    PrintLine();
    for i in 0..count {
        ptr[i] = i as uint;
    }
    PrintLine("Initialized array with values:");
    for i in 0..count {
        Print("{}; ", ptr[i]);
    }
    PrintLine();
    var sum: uint = 0;
    for i in 0..count {
        sum += ptr[i];
    }
    PrintLine("Sum of array values: {}", sum);
    Free(ptr);
    PrintLine("Freed memory at address {}", ptr as uint);
    return 0;
}
`,
  },
  {
    value: "circle",
    label: "Circle",
    icon: "i-lucide-circle-dashed",
    description: "Reads a radius from standard input.",
    stdin: "2.5\n",
    source: String.raw`import Format::ParseFloat64;
import Io::{ Print, PrintLine, ReadLine };
import Math::Pi;

func Main() -> int {
    Print("Circle radius: ");
    let input = ReadLine();             // read String from stdin
    let result = ParseFloat64(input);   // convert String to float64
    match result {                      // test result of converting
        .Success(radius) => {
            PrintLine("Circumference: {}", 2.0 * Pi * radius);
            PrintLine("Area: {}", Pi * radius * radius);
        },
        .Error(_) => {
            PrintLine("Invalid radius");
            return 1;
        }
    }
    return 0;
}
`,
  },
];

/** The program the page opens on. */
export const defaultPlaygroundExample: PlaygroundExample = playgroundExamples[0]!;

export function playgroundExample(value: string): PlaygroundExample | null {
  return playgroundExamples.find((item) => item.value === value) ?? null;
}
