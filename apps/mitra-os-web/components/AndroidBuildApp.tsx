import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Smartphone,
  Code,
  Copy,
  Check,
  MessageSquare,
  Library,
  ShieldCheck,
  Cpu,
  RefreshCw,
} from "lucide-react";

const AndroidBuildApp: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState(
    window.location.origin || "https://dukaanmitra.in",
  );
  const [whatsappMsgType, setWhatsappMsgType] = useState("full-app");
  const [customPhone, setCustomPhone] = useState("+919458276088"); // Amit Sharma's reference or default support
  const [activeTab, setActiveTab] = useState<"kotlin" | "java">("kotlin");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Predefined Message types for Admin WhatsApp contact
  const messageTemplates: Record<string, string> = {
    "full-app": `Hello DukaanMitra Admin, I want to get the pre-compiled full working DukaanMitra Android App (.apk) for my store! Please guide me on accessing all the premium tools, WhatsApp synchronization, and ledger reporting. Thanks!`,
    "custom-bot": `Hello Admin, I am interested in DukaanMitra's Custom WhatsApp Shop Bot integration for my business. I need real-time customer billing alerts sent directly from my android app. Please share process and pricing.`,
    "developer-setup": `Hi Amit, I'm trying to compile the DukaanMitra WebView wrapper project in Android Studio. I need some assistance with the Javascript Interface setup and the WhatsApp intent handler. Let's connect!`,
  };

  const getWhatsAppLink = () => {
    const baseMsg =
      messageTemplates[whatsappMsgType] || messageTemplates["full-app"];
    const encoded = encodeURIComponent(baseMsg);
    // Remove space/special chars from phone for wa.me API
    const cleanPhone = customPhone.replace(/[^0-9+]/g, "");
    return `https://wa.me/${cleanPhone.replace("+", "")}?text=${encoded}`;
  };

  // Code snippets for copy pasting
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.dukaanmitra.app">

    <!-- CRITICAL PERMISSIONS FOR DUKAANMITRA REAL TIME FUNCTIONALITY -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" /> <!-- For scanning QR and bills -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="DukaanMitra"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar"
        android:usesCleartextTraffic="true"> <!-- Cleartext allowed for local development nodes -->
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const kotlinCode = `package com.dukaanmitra.app

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Dynamic WebView Instantiation
        webView = WebView(this)
        setContentView(webView)

        // Production-Ready WebView Configurations
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            userAgentString = "DukaanMitra-Native-Android-v2.0"
        }

        // WhatsApp deep link support and custom route interceptor
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                // Route WhatsApp calls, telephone links, and external maps safely
                if (url.startsWith("whatsapp:") || url.contains("wa.me") || url.startsWith("tel:") || url.startsWith("mailto:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "WhatsApp App not installed or Link Invalid", Toast.LENGTH_SHORT).show()
                        return true
                    }
                }
                return false
            }
        }

        // Handle File upload, JS Alerts, and Geolocation requests
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                // Instantly grant resources for camera/mic access inside DukaanMitra
                runOnUiThread {
                    request?.grant(request.resources)
                }
            }
        }

        // Render target web URL dynamically
        webView.loadUrl("${targetUrl}")
    }

    // Capture hardware Back Button to navigate WebView history rather than closing app
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

  const javaCode = `package com.dukaanmitra.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.PermissionRequest;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUserAgentString("DukaanMitra-Native-Android-v2.0");

        // Custom URL Overrider for deep links (especially WhatsApp)
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("whatsapp:") || url.contains("wa.me") || url.startsWith("tel:") || url.startsWith("mailto:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "WhatsApp Client not installed on this device", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> request.grant(request.getResources()));
            }
        });

        webView.loadUrl("${targetUrl}");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Helmet>
        <title>Android Studio App Compiler & Working Tool | DukaanMitra</title>
        <meta
          name="description"
          content="Build your custom Android version of DukaanMitra using Android Studio. Access fully functional WebView templates, WhatsApp intent support, and direct admin consultation."
        />
      </Helmet>

      {/* Hero Banner Grid Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-20 overflow-hidden bg-radial from-indigo-900/40 via-transparent to-transparent">
        <div className="absolute inset-0 z-0 opacity-15 " />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              Android SDK Integration Protocol
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
              BUILD WITH <span className="text-indigo-400">ANDROID STUDIO</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Want a fully integrated APK working on your Android smartphone?
              Build it directly using Android Studio with our optimized
              low-latency WebView configuration, or contact the Admin
              immediately to deploy a customized build synced with your real
              WhatsApp Business automation!
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#whatsapp-admin"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-3xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_8px_30px_rgb(16,185,129,0.3)]"
              >
                <Smartphone className="w-5 h-5 fill-slate-950" />
                Contact Admin For Complete App ➔
              </a>
              <a
                href="#developer-steps"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm uppercase tracking-wider rounded-3xl transition-transform hover:scale-105 active:scale-95 border-2 border-slate-700/50 flex items-center gap-3"
              >
                <Code className="w-5 h-5" />
                View SDK Source Code
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Visual Phone Frame Wrapper showcasing DukaanMitra Android App view */}
            <div className="relative w-80 h-[560px] bg-slate-900 rounded-[3rem] p-4 shadow-[0_0_50px_rgba(99,102,241,0.25)] border-[8px] border-slate-800 overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-black/40 rounded-full" />
              </div>

              {/* Inner Live Screen Mockup */}
              <div className="relative w-full h-full bg-slate-900 rounded-[2.2rem] overflow-hidden flex flex-col pt-4">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700/50 flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <span className="font-bold flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />{" "}
                    dukaanmitra.in
                  </span>
                  <span className="text-emerald-400 font-bold">● ACTIVE</span>
                </div>

                {/* Simulated App Screen View */}
                <div className="flex-1 p-6 space-y-6 flex flex-col justify-between select-none">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-black italic">
                        D
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white font-black text-lg tracking-tight uppercase italic">
                        DukaanMitra Mobile
                      </h4>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-none">
                        Bharat's Ledger Console
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 space-y-3">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Today's Total Sales</span>
                        <span className="text-emerald-400 font-bold">
                          ₹12,480
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Pending Udhaars</span>
                        <span className="text-rose-400 font-bold">₹3,250</span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[78%]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-2xl text-[10px] text-emerald-300 font-medium italic">
                      "Real-time WhatsApp billing triggered successfully on
                      invoice compilation!"
                    </div>
                    <button className="w-full bg-indigo-600 text-white font-black uppercase text-[10px] tracking-wider py-3 rounded-xl shadow-lg shadow-indigo-600/30">
                      Syncing Mobile Ledger
                    </button>
                    <div className="text-center text-[8px] text-slate-500 uppercase font-bold tracking-widest">
                      Optimized for Android 14 SDK
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP CONTACT TO GET FULL WORKING TOOL SECTION */}
      <section
        id="whatsapp-admin"
        className="py-24 px-6 lg:px-20 bg-slate-900 border-y border-slate-800/80"
      >
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-950/80 to-slate-900 p-10 md:p-16 rounded-[4rem] border-2 border-indigo-500/30 shadow-3xl text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-black uppercase text-xs tracking-[0.2em] rounded-full border border-emerald-500/20 inline-flex items-center gap-2">
              <MessageSquare className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              WhatsApp Admin Protocol
            </span>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
              ACCESS FULL REAL{" "}
              <span className="text-emerald-400">WORKING APP</span> TOOL
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Running into code compiler errors in Android Studio or need the
              premium database connectivity module? Skip the setup! We provide a
              ready-to-run optimized application package (.apk) complete with a
              live backend cluster. Connect with the founder & admin **Amit
              Sharma** directly on WhatsApp below.
            </p>
          </div>

          {/* Interactive Direct Contact Configurator */}
          <div className="max-w-xl mx-auto p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800 space-y-6 text-left relative z-10">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Choose your Request Blueprint:
            </h4>

            <div className="space-y-3">
              {[
                {
                  id: "full-app",
                  title: "Complete Pre-Compiled APK Deployment",
                  desc: "Get official compiled APK with full local storage data persistence support.",
                },
                {
                  id: "custom-bot",
                  title: "WhatsApp Automation Integration",
                  desc: "Trigger auto SMS/ledgers logs using dedicated WhatsApp Bot API.",
                },
                {
                  id: "developer-setup",
                  title: "Developer Android Studio Setup Help",
                  desc: "Connect for consultation on custom Android Java & Kotlin wrappers.",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  onClick={() => setWhatsappMsgType(item.id)}
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    whatsappMsgType === item.id
                      ? "border-emerald-500 bg-emerald-950/20"
                      : "border-slate-800 hover:border-slate-700 bg-black/20"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <input
                      type="radio"
                      name="msgType"
                      checked={whatsappMsgType === item.id}
                      onChange={() => {}}
                      className="mt-1 accent-emerald-400"
                    />
                    <div>
                      <h5 className="font-black text-xs text-white uppercase tracking-wider leading-relaxed">
                        {item.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Simulated Live Preview of WhatsApp message */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Prefilled Custom WhatsApp Message Preview:
              </label>
              <div className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[10px] leading-relaxed border border-slate-800 whitespace-pre-wrap">
                "{messageTemplates[whatsappMsgType]}"
              </div>
            </div>

            {/* Custom Admin Phone Input */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Target Admin Support:
                </label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+919458276088"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 mt-1"
                />
              </div>
            </div>

            {/* Pulse triggering button */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-5 rounded-2xl font-black text-sm uppercase tracking-wider text-center block shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
              🚀 Send Message to Admin on WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Direct Admin
              Handover
            </span>
            <span className="flex items-center gap-2">
              <Library className="w-4 h-4 text-indigo-400" /> Complete Setup
              Assured
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-pink-400" /> Fully Encrypted
              Tunneling
            </span>
          </div>
        </div>
      </section>

      {/* DETAILED INTERACTIVE STEP-BY-STEP ANDROID STUDIO COMPILING GUIDE */}
      <section
        id="developer-steps"
        className="py-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-16"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
            ANDROID STUDIO <span className="text-indigo-400">BUILD MANUAL</span>
          </h2>
          <p className="text-lg text-slate-400 font-bold italic">
            Configure, build, and deploy your custom companion APK following our
            simple 5-step integration protocol.
          </p>
        </div>

        {/* Dynamic target url configurations for developers */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 grid md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-black italic text-lg text-white uppercase">
              Applet Web Endpoint
            </h4>
            <p className="text-xs text-slate-400 font-semibold">
              Customize the WebView URL that the compiled Android app will point
              to:
            </p>
          </div>
          <div className="md:col-span-8 flex gap-3">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://dukaanmitra.in"
              className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 font-mono text-sm text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setTargetUrl(window.location.origin)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 rounded-2xl flex items-center justify-center text-xs font-black uppercase text-slate-300 gap-2 border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* The 5 Steps */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="grid lg:grid-cols-12 gap-8 bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800">
            <div className="lg:col-span-4 space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl italic border border-indigo-500/20">
                01
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white">
                Create New Project
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Open Android Studio, select **"Empty Views Activity"** (or Empty
                Activity), and click Next. Use the configuration properties
                listed on the right side.
              </p>
            </div>
            <div className="lg:col-span-8 p-6 bg-slate-950 rounded-2xl border border-slate-800/80 grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  Project Name
                </span>
                <p className="text-xs font-mono font-bold text-slate-200">
                  DukaanMitra Companion
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  Package Name
                </span>
                <p className="text-xs font-mono font-bold text-slate-200">
                  com.dukaanmitra.app
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  Minimum SDK
                </span>
                <p className="text-xs font-mono font-bold text-slate-200">
                  API 26: Android 8.0 (Oreo) or higher
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  Build Language
                </span>
                <p className="text-xs font-mono font-bold text-slate-200">
                  Kotlin DSL / Groovy
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid lg:grid-cols-12 gap-8 bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800">
            <div className="lg:col-span-4 space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl italic border border-indigo-500/20">
                02
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white">
                Configure AndroidManifest.xml
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Declare the required permissions for DukaanMitra. Copy and
                replace this code inside your AndroidManifest configurations
                file to authorize secure internet access, camera integration,
                and internal file rendering.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-2">
              <div className="flex justify-between items-center px-4 py-2 bg-slate-950 rounded-t-xl border-t border-x border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">
                  AndroidManifest.xml
                </span>
                <button
                  onClick={() => copyToClipboard(manifestXml, "manifest")}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-black uppercase text-slate-300 flex items-center gap-1.5"
                >
                  {copiedText === "manifest" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedText === "manifest" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-6 bg-slate-950 border border-slate-800 rounded-b-xl overflow-x-auto text-[11px] font-mono text-slate-300 max-h-80 leading-relaxed">
                {manifestXml}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-12 gap-8 bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800">
            <div className="lg:col-span-4 space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl italic border border-indigo-500/20">
                03
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white">
                Write WebView Controller Code
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Replace your `MainActivity` file inside
                `/src/main/java/com/dukaanmitra/app/`. This implements
                customized override settings enabling clean redirects to
                WhatsApp whenever buttons are tapped.
              </p>

              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab("kotlin")}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
                    activeTab === "kotlin"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Kotlin (Recommended)
                </button>
                <button
                  onClick={() => setActiveTab("java")}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
                    activeTab === "java"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Java Legacy
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-2">
              <div className="flex justify-between items-center px-4 py-2 bg-slate-950 rounded-t-xl border-t border-x border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">
                  {activeTab === "kotlin"
                    ? "MainActivity.kt"
                    : "MainActivity.java"}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      activeTab === "kotlin" ? kotlinCode : javaCode,
                      "activityCode",
                    )
                  }
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-black uppercase text-slate-300 flex items-center gap-1.5"
                >
                  {copiedText === "activityCode" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedText === "activityCode" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-6 bg-slate-950 border border-slate-800 rounded-b-xl overflow-x-auto text-[11px] font-mono text-indigo-300 max-h-[460px] leading-relaxed">
                {activeTab === "kotlin" ? kotlinCode : javaCode}
              </pre>
            </div>
          </div>

          {/* Step 4 & 5 summary timeline logs */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 4 */}
            <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl italic border border-indigo-500/20">
                04
              </div>
              <h3 className="text-xl font-black italic uppercase text-white">
                Generate Launch Icons
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold font-mono">
                Right-click the res/mipmap resource directory in Android Studio,
                select "New - Image Asset". Choose an elegant icon for
                DukaanMitra, align margins as needed, and hit Compile.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800 space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl italic border border-indigo-500/20">
                05
              </div>
              <h3 className="text-xl font-black italic uppercase text-white">
                Compile Release APK
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold font-mono">
                Go to "Build - Generate Signed Bundle / APK" inside the Android
                Studio top menu. Export your release APK using standard keystore
                variables, run the APK installer package on your target Android
                device, and instantly enjoy DukaanMitra!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION BANNER */}
      <section className="py-24 px-6 lg:px-20 bg-indigo-600 text-white rounded-t-[4rem] text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
            Real WhatsApp Integration Hub
          </span>
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Get Complete Admin Setup Support Now
          </h2>
          <p className="text-xl font-bold italic opacity-90 max-w-2xl mx-auto">
            Need WhatsApp API automation synced directly with your stock
            updates, or custom android hardware printing solutions? Tell the
            Admin immediately.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all inline-block italic tracking-tighter hover:bg-emerald-400 hover:text-slate-905"
          >
            Start Chat with Admin ➔
          </a>
        </div>
      </section>
    </div>
  );
};

export default AndroidBuildApp;
