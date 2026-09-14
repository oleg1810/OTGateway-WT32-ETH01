#pragma once
#include <Arduino.h>

// Captures everything written to Log (via Log.addStream(&bootLog)) into a
// fixed-size RAM ring buffer, starting from the very first line at boot -
// including the window before the network/Telnet/web server are reachable.
// Read it back later (once the network IS up) via dump()/toString(), e.g.
// from an HTTP endpoint or a freshly-connected Telnet session.
// Inherits Stream (not just Print) because TinyLogger::addStream() requires
// a Stream* - the read side (available/read/peek) is unused and stubbed out,
// this is a write-only sink.
class BootLog : public Stream {
  public:
    explicit BootLog(size_t capacity) : _capacity(capacity) {
      _buf = (char*) malloc(capacity);
    }

    size_t write(uint8_t c) override {
      if (!_buf) {
        return 0;
      }

      _buf[_head] = (char) c;
      _head = (_head + 1) % _capacity;

      if (_len < _capacity) {
        _len++;
      } else {
        _wrapped = true;
      }

      return 1;
    }

    size_t write(const uint8_t* buffer, size_t size) override {
      for (size_t i = 0; i < size; i++) {
        write(buffer[i]);
      }
      return size;
    }

    // Replay the buffered content, oldest line first, to any Print target
    // (Serial, a freshly connected Telnet client, an HTTP response, etc.)
    void dump(Print& out) {
      if (!_buf || _len == 0) {
        return;
      }

      size_t start = _wrapped ? _head : 0;
      for (size_t i = 0; i < _len; i++) {
        out.write((uint8_t) _buf[(start + i) % _capacity]);
      }
    }

    // Same content as a String, for handlers that need a complete buffer
    // up front (e.g. WebServer::send()) rather than a streaming Print target.
    String toString() {
      String result;
      if (!_buf || _len == 0) {
        return result;
      }

      result.reserve(_len);
      size_t start = _wrapped ? _head : 0;
      for (size_t i = 0; i < _len; i++) {
        result += _buf[(start + i) % _capacity];
      }
      return result;
    }

    // Stream read-side is unused (write-only sink) - stubbed to satisfy the
    // abstract interface.
    int available() override { return 0; }
    int read() override { return -1; }
    int peek() override { return -1; }

  protected:
    char* _buf = nullptr;
    size_t _capacity;
    size_t _head = 0;
    size_t _len = 0;
    bool _wrapped = false;
};
