package com.koreanit.spring.common.logging;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class AuditLogStore {

  private static final int MAX_SIZE = 200;
  private final Deque<AuditLogEntry> entries = new ArrayDeque<>();

  public synchronized void add(AuditLogEntry e) {
    entries.addFirst(e);
    while (entries.size() > MAX_SIZE) entries.removeLast();
  }

  public synchronized List<AuditLogEntry> recent(int limit) {
    int l = Math.max(1, Math.min(limit, 100));
    List<AuditLogEntry> out = new ArrayList<>(l);
    int i = 0;
    for (AuditLogEntry e : entries) {
      if (i++ >= l) break;
      out.add(e);
    }
    return out;
  }
}
