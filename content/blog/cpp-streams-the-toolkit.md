---
title: "C++ Streams: The Toolkit"
date: 2026-06-06
draft: false
---

You know what a stream is. You know why `endl` costs you. You know the buffer.

Now let's talk about what you can actually do with streams — format output precisely, read and write files without ceremony, and parse strings like they're `cin`. Same pipe. More control.

---

## Manipulators: Functions in Disguise

You already know one manipulator: `endl`. It looks like data but it's actually a function call — it takes the stream, does something to it, and returns it.

Every manipulator works this way. They're not values being inserted. They're instructions to the stream.

```cpp
cout << hex << 255 << "\n";  // ff
```

`hex` doesn't insert anything. It flips a formatting flag on `cout`. Every number printed after that comes out in hexadecimal — until you change it.

That's the key thing about manipulators: some are **sticky**, some aren't.

### Sticky vs Non-Sticky

```cpp
// setw — non-sticky. Resets after one insertion.
cout << setw(10) << 42 << "\n";   // "        42"
cout << 42 << "\n";               // "42" — setw is gone

// setprecision — sticky. Persists until changed.
cout << fixed << setprecision(2) << 3.14159 << "\n";  // 3.14
cout << 2.71828 << "\n";                              // 2.72 — still active
```

Mix these up and your formatting silently breaks two lines later. No warning. No error. Just wrong output.

### Resetting Sticky Manipulators

Most sticky manipulators have a `no`-prefixed counterpart. The ones that don't, get reset manually to their default value.

```cpp
// Number base — use dec to reset
cout << hex;          // switched to hex
cout << dec;          // back to decimal (default)

// Float format — use defaultfloat to reset
cout << fixed;
cout << defaultfloat; // back to default

// Precision — no reset keyword, set back to default manually
cout << setprecision(2);
cout << setprecision(6);  // 6 is the default

// Fill character — no reset keyword, set back to default manually
cout << setfill('0');
cout << setfill(' ');  // space is the default

// Alignment
cout << left;
cout << right;        // right is the default

// Booleans
cout << boolalpha;
cout << noboolalpha;  // back to 1/0

// Sign
cout << showpos;
cout << noshowpos;

// Base prefix
cout << showbase;
cout << noshowbase;
```

Rule of thumb: if it starts with `show` or ends in `alpha`, there's a `no` version. Otherwise, set it back to its default value explicitly.

### Number Formatting

```cpp
cout << hex << 255 << "\n";   // ff
cout << oct << 255 << "\n";   // 377
cout << dec << 255 << "\n";   // 255  ← back to decimal

// uppercase hex digits
cout << uppercase << hex << 255 << "\n";  // FF

// show base prefix
cout << showbase << hex << 255 << "\n";   // 0xff
```

All sticky. Once you switch to `hex`, every integer prints in hex until you say `dec`.

### Floating Point

```cpp
cout << fixed << setprecision(2) << 3.14159 << "\n";      // 3.14
cout << scientific << setprecision(3) << 3.14159 << "\n"; // 3.142e+00
cout << defaultfloat << 3.14159 << "\n";                  // 3.14159 — back to default
```

`fixed` and `scientific` are sticky. `setprecision` is sticky. Switch back to `defaultfloat` when you're done or every float in your program prints with that precision.

### Width, Fill, Alignment

```cpp
// Right-align (default), padded with spaces
cout << setw(10) << 42 << "\n";             // "        42"

// Left-align
cout << left << setw(10) << 42 << "\n";     // "42        "

// Custom fill character
cout << setw(10) << setfill('0') << 42 << "\n";  // "0000000042"
cout << setw(10) << setfill('-') << 42 << "\n";  // "--------42"
```

`setfill` is sticky. `setw` is not. A common pattern — set fill once, set width before every insertion.

### Booleans and Signs

```cpp
cout << boolalpha << true << "\n";   // true (not 1)
cout << boolalpha << false << "\n";  // false (not 0)

cout << showpos << 42 << "\n";  // +42
```

`boolalpha` and `showpos` are sticky. Reset with `noboolalpha` and `noshowpos`.

### The Full Sticky/Non-Sticky Cheatsheet

| Manipulator | Sticky? |
|-------------|---------|
| `setw` | no |
| `setprecision` | yes |
| `setfill` | yes |
| `hex`, `oct`, `dec` | yes |
| `fixed`, `scientific` | yes |
| `left`, `right` | yes |
| `boolalpha` | yes |
| `showbase`, `showpos` | yes |
| `endl`, `flush` | — (one-time action) |

When in doubt — assume sticky and reset explicitly.

---

## File Streams: Same Interface, Different Destination

This is where the stream abstraction pays off. Everything you know about `cout` and `cin` works on files. Same operators. Same manipulators. Same state flags.

```cpp
#include <fstream>
```

### Writing

```cpp
ofstream out("output.txt");

if (!out) {
    cerr << "Failed to open file\n";
    return 1;
}

out << "Line one\n";
out << "Line two\n";
// File closes when out goes out of scope — RAII
```

Always check if the file opened. `ofstream` doesn't throw by default — it just silently fails and every write becomes a no-op.

### Reading

```cpp
ifstream in("data.txt");

if (!in) {
    cerr << "File not found\n";
    return 1;
}

// Read line by line
string line;
while (getline(in, line)) {
    cout << line << "\n";
}

// Read word by word
string word;
while (in >> word) {
    cout << word << "\n";
}

// Read token by token with type
int n;
double d;
in >> n >> d;
```

`getline` and `>>` work exactly like they do with `cin`. The same ghost newline trap applies if you mix them.

### Open Modes

```cpp
// Truncate — clear the file on open (default for ofstream)
ofstream out("log.txt", ios::trunc);

// Append — add to existing content
ofstream out("log.txt", ios::app);

// Read + write
fstream f("data.txt", ios::in | ios::out);

// Binary mode — no newline translation
ofstream out("image.bin", ios::binary);
```

Combine modes with `|`. The most common mistake: forgetting `ios::app` and wiping a log file on every run.

### RAII — The Destructor Does the Work

```cpp
void writeReport() {
    ofstream out("report.txt");
    out << "Done\n";
    // out destructor runs here — file is closed
}
```

You don't need to call `out.close()` explicitly in most cases. The destructor handles it when the object leaves scope. This means no leaked file handles, even if an exception fires mid-function.

Call `close()` explicitly only when you need to reopen the file or check for write errors before the function ends.

```cpp
out.close();
if (!out) {
    cerr << "Write may have failed\n";
}
```

---

## String Streams: Streams in Memory

Sometimes you don't want to write to the terminal or a file. You want to build a string, or parse one. String streams give you the full stream interface — but backed by memory.

```cpp
#include <sstream>
```

Three types: `ostringstream` (write), `istringstream` (read), `stringstream` (both).

### Building Strings

```cpp
ostringstream oss;
oss << "Order #" << 1042 << " — total: $" << fixed << setprecision(2) << 99.5;
string msg = oss.str();
// "Order #1042 — total: $99.50"
```

Every manipulator works here too. `fixed`, `setprecision`, `hex` — all of it. This is cleaner than concatenating strings manually, especially when you're mixing types.

### Parsing Strings

```cpp
string record = "Alice 28 9.5";
istringstream iss(record);

string name;
int age;
double score;

iss >> name >> age >> score;
// name="Alice", age=28, score=9.5
```

Think of it as `cin` but for a string you already have. Parse CSV lines, config entries, log records — same `>>` operator, no file needed.

```cpp
// Parsing a CSV line
string line = "10,3.14,hello";
replace(line.begin(), line.end(), ',', ' ');  // swap commas for spaces
istringstream iss(line);

int n; double d; string s;
iss >> n >> d >> s;  // n=10, d=3.14, s="hello"
```

### Type Conversion

A common use case — converting anything to a string and back:

```cpp
// To string
template<typename T>
string toString(const T& val) {
    ostringstream oss;
    oss << val;
    return oss.str();
}

string s = toString(3.14);   // "3.14"
string s2 = toString(255);   // "255"

// From string
template<typename T>
T fromString(const string& str) {
    istringstream iss(str);
    T val;
    iss >> val;
    return val;
}

int n = fromString<int>("42");        // 42
double d = fromString<double>("3.14"); // 3.14
```

In modern C++ (C++11 onwards) you'd use `to_string()` and `stoi()`/`stod()` for simple cases. But `stringstream` shines when you need formatting control — precision, bases, padding — during the conversion.

### Reusing a String Stream

```cpp
ostringstream oss;
oss << "first";
oss.str("");       // clear the content
oss.clear();       // reset state flags
oss << "second";
cout << oss.str(); // "second"
```

`str("")` clears the buffer. `clear()` resets the flags. You need both — `str("")` alone leaves the stream in whatever state it was in.

---

## When a Stream Breaks

Every stream — `cin`, `cout`, `ifstream`, `ofstream`, all of them — tracks its own health through four state flags: `good()`, `fail()`, `eof()`, `bad()`. They live on the base class, so the same flags and the same recovery steps apply everywhere. Reading a file? Same flags. Writing to a string stream? Same flags.

Normal flow — everything is fine, `good()` is true, reads work. The moment something goes wrong, the stream raises a flag and **stops reading**. Not an exception. Not a crash. Just silence. Every `>>` after that point is a no-op.

The most common trigger: type mismatch.

```cpp
int x;
cin >> x;  // user types "abc"
```

`cin` expected digits. Got letters. It sets `fail()`, leaves `"abc"` sitting in the buffer, and shuts down. Now this:

```cpp
cin >> x;  // user types "42"
```

Never executes. `cin` is failed. It doesn't matter what the user types — nothing gets through.

To recover, you need two steps:

```cpp
if (cin.fail()) {
    cin.clear();                                      // step 1: reset the fail flag — cin is "healthy" again
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // step 2: throw away the garbage in the buffer
}
```

`clear()` alone isn't enough. The bad input is still in the buffer. The next read picks it up, fails again, and you're back where you started. Both lines, in order.

Don't forget the header:

```cpp
#include <limits>
```

`bad()` is a different beast. It doesn't mean wrong input — it means the stream itself is broken. Underlying hardware failure, corrupted file, OS-level I/O error. The kind of thing you can't recover from in user code.

```cpp
if (cin.bad()) {
    // No point trying to clear and continue.
    // The stream is physically broken.
    throw std::runtime_error("Stream corrupted");
}
```

The four flags — on every stream:

| Flag     | Meaning                      | Recoverable?                                    |
|----------|------------------------------|-------------------------------------------------|
| `good()` | all clear, reads will work   | —                                               |
| `fail()` | bad input or format mismatch | yes — `clear()` + `ignore()`                    |
| `eof()`  | end of input reached         | sometimes — `clear()` if more input is expected |
| `bad()`  | stream physically corrupted  | no                                              |

`fail()` is the everyday one. `bad()` is the one you hope never fires.

---

## The Same Pipe, Every Time

Manipulators, file streams, string streams — different tools, same foundation. Learn the abstraction once and the rest follows.

Four rules that carry across all three:

- Assume manipulators are sticky. Reset explicitly when you're done.
- Always check if a file stream opened. Silent failures are worse than loud ones.
- `str("")` + `clear()` to reuse a string stream. One without the other leaves a mess.
- The ghost newline trap from `cin` applies to `istringstream` too. Same pipe, same rules.

The stream doesn't care where it's writing. You just push data in. That's the whole idea.