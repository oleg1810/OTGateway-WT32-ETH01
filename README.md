# OTGateway — experimental hardware fork

This repository is an **experimental fork of [Laxilef/OTGateway](https://github.com/Laxilef/OTGateway)**.

It is **not an independently developed OpenTherm gateway project**. The application, core functionality, most of the source code, and the original web interface originate from the upstream OTGateway project.

The purpose of this fork is to test hardware-specific adaptations and stability improvements on three ESP32 boards:

| Board | PlatformIO environment | Status / purpose |
|---|---|---|
| **Lolin S2 Mini (ESP32-S2)** | `s2_mini` | Legacy/experimental target; resource-constrained platform |
| **ESP32-S3 N16R8** | `s3_mini_n16r8` | Modern dual-core target; stability testing |
| **WT32-ETH01** | `wt32_eth01` | Modern dual-core Ethernet target |

The project deliberately does **not** try to make one set of resource parameters fit every ESP32 board. Board-specific PlatformIO environments are used where hardware capabilities differ. The measured task-stack tuning is currently enabled only for the resource-constrained ESP32-S2 target; ESP32-S3 N16R8 and WT32-ETH01 use the upstream 10 KB task-stack allocation.

## Upstream project

**Original project:** [Laxilef/OTGateway](https://github.com/Laxilef/OTGateway)

**Upstream baseline:** OTGateway 1.6.0

Use the upstream repository and wiki for the original feature set, boiler compatibility, configuration, OpenTherm documentation, and general instructions:

- [OTGateway repository](https://github.com/Laxilef/OTGateway)
- [OTGateway Wiki](https://github.com/Laxilef/OTGateway/wiki)
- [Compatibility](https://github.com/Laxilef/OTGateway/wiki/Compatibility)

## Experimental changes in this fork

- **Static portal navigation:** portal page navigation is generated at build time instead of being created by the runtime navigation script. This removes the runtime `nav.js` navigation path that was associated with stability problems on the ESP32-S2.
- **Board-specific task stack sizing:** the ESP32-S2 build uses reduced task stacks based on measured stack high-water marks. The ESP32-S3 N16R8 and WT32-ETH01 builds retain the upstream 10 KB task-stack allocation.
- **Local ESP32Scheduler copy:** the fork keeps a local scheduler copy so task handles can be inspected without changing the scheduler API used by the application.
- **Runtime diagnostics:** additional HTTP endpoints expose system and task information useful for hardware and stability testing.
- **Board-specific build environments:** S2, S3 N16R8, and WT32-ETH01 configurations are maintained separately in `platformio.ini`.

These changes are experimental and are **not part of the official upstream OTGateway project** unless they are accepted upstream.

## Additional diagnostics

The experimental branch adds diagnostic information intended primarily for development and hardware testing.

`/api/debug` can report:

- firmware version, build date and PlatformIO environment;
- Arduino core and ESP-IDF SDK versions;
- total heap, current free heap, minimum free heap, largest free block, and minimum largest free block;
- chip model, revision, core count and CPU frequency;
- flash size;
- stored crash/reset information and backtrace data when a previous abnormal reset was recorded.

`/api/tasks` reports the **stack high-water mark** for the MQTT, OpenTherm, Sensors, Regulator, Portal and Main tasks. This is used to size task stacks from measurements rather than guesswork.

`/api/bootlog` exposes the retained boot log through the web interface.

These endpoints are intended as diagnostic tools and are not part of the upstream OTGateway interface.

## Hardware notes

### ESP32-S2

ESP32-S2 is a **single-core** platform and different S2 Mini variants have different memory configurations. In Espressif's part-numbering, **ESP32-S2FN4R2 has 4 MB embedded flash and 2 MB embedded PSRAM**, while ESP32-S2FH4 has 4 MB flash and no embedded PSRAM. This distinction can materially affect available RAM and web-interface stability.

### ESP32-S3 N16R8

This is one of the modern dual-core targets of the fork. The N16R8 configuration uses 16 MB flash and is tested separately from the S2 configuration.

### WT32-ETH01

WT32-ETH01 is used here as an **Ethernet target**. The current `wt32_eth01` environment does not change the upstream web interface or apply the experimental memory reductions used during S2/S3 testing.

## Current development status

The project is tested on physical hardware. Stability work is performed by changing one relevant variable at a time and checking long-running operation, network behaviour, heap headroom, task stack headroom, and reset information.

For WT32-ETH01, the current priority is hardware stability testing before making further firmware changes. In particular, DS18B20 wiring is treated separately from firmware behaviour.

## Building

PlatformIO environments for the three target boards are:

```text
pio run -e s2_mini
pio run -e s3_mini_n16r8
pio run -e wt32_eth01
```

Additional experimental S3 environments are also present in `platformio.ini`.

## Attribution

This repository is based on the work of **Laxilef and the OTGateway contributors**.

Third-party libraries and components are also used; see the upstream project and source tree for the relevant licenses and attribution.

## License

This fork is intended to remain under the **GNU GPL v3** license of the upstream OTGateway project. See the upstream repository for the canonical license text.
