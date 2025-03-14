#pragma once

#ifndef VERSION_MAJOR
#define VERSION_MAJOR 0
#endif

#ifndef VERSION_MINOR
#define VERSION_MINOR 1
#endif

#ifndef VERSION_PATCH
#define VERSION_PATCH 0
#endif

#ifndef VERSION_HASH
#define VERSION_HASH "(none)"
#endif

namespace version {
constexpr int value[3] = {VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH};
constexpr const char *hash = VERSION_HASH;
} // namespace version
