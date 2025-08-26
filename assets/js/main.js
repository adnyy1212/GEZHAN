(function(){
	"use strict";

	// 填充年份
	const yearSpan = document.getElementById("year");
	if (yearSpan) {
		yearSpan.textContent = String(new Date().getFullYear());
	}

	// 轻量交互：摸摸猫
	const petBtn = document.getElementById("petCat");
	const signature = document.querySelector(".signature");
	if (petBtn && signature) {
		petBtn.addEventListener("click", function(e){
			e.preventDefault();
			const original = signature.textContent || "";
			signature.textContent = "喵～ (≚ᄌ≚)ﻭ";
			signature.classList.add("text-primary");
			setTimeout(()=>{
				signature.textContent = original;
				signature.classList.remove("text-primary");
			}, 1200);
		});
	}

	// 自定义下拉逻辑
	const docsToggle = document.getElementById("docsToggle");
	const docsMenu = document.getElementById("docsMenu");
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) {
			docsMenu.classList.add("show");
		} else {
			docsMenu.classList.remove("show");
		}
	}

	function closeMenu() {
		isMenuOpen = false;
		docsMenu.classList.remove("show");
	}

	if (docsToggle && docsMenu) {
		docsToggle.addEventListener("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			toggleMenu();
		});

		// 点击外部关闭
		document.addEventListener("click", function(e) {
			if (!docsToggle.contains(e.target) && !docsMenu.contains(e.target)) {
				closeMenu();
			}
		});

		// 防止菜单内部点击关闭
		docsMenu.addEventListener("click", function(e) {
			e.stopPropagation();
		});
	}

	// 链接存储、标签与搜索 + 底部滚动条
	const STORAGE_KEY = "ai_docs_links_v2"; // 新版本包含 tags
	const form = document.getElementById("linkForm");
	const titleInput = document.getElementById("linkTitle");
	const urlInput = document.getElementById("linkUrl");
	const tagsInput = document.getElementById("linkTags");
	const searchInput = document.getElementById("linkSearch");
	const list = document.getElementById("savedLinks");
	const tickerTrack = document.getElementById("linksTickerTrack");

	function readLinks(){
		try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }catch{ return []; }
	}
	function writeLinks(items){
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}
	function isValidUrl(value){
		try{ new URL(value); return true; } catch { return false; }
	}
	function normalizeTags(input){
		return (input || "")
			.split(/[，,]/)
			.map(s=>s.trim())
			.filter(Boolean)
			.slice(0,8);
	}

	function buildTickerContent(items){
		if(!tickerTrack) return;
		tickerTrack.innerHTML = "";
		const titleNodes = [];
		items.forEach(it=>{
			const a = document.createElement("a");
			a.href = it.url;
			a.target = "_blank";
			a.rel = "noreferrer noopener";
			a.textContent = it.title || it.url;
			a.className = "small";
			titleNodes.push(a);
		});
		// 少于1条则不滚动
		if (titleNodes.length === 0) {
			const empty = document.createElement("span");
			empty.className = "text-secondary small";
			empty.textContent = "暂无已保存链接";
			tickerTrack.appendChild(empty);
			return;
		}
		// 复制两份以实现无缝滚动
		[...titleNodes, ...titleNodes].forEach((node, idx)=>{
			const wrap = document.createElement("span");
			wrap.className = "d-inline-block";
			wrap.appendChild(node.cloneNode(true));
			if (idx !== titleNodes.length*2 - 1) {
				const sep = document.createElement("span");
				sep.className = "text-secondary";
				sep.textContent = " · ";
				wrap.appendChild(sep);
			}
			tickerTrack.appendChild(wrap);
		});
	}

	function renderLinks(){
		const items = readLinks();
		// 左侧列表（下拉）
		if(list){
			const q = (searchInput?.value || "").trim().toLowerCase();
			list.innerHTML = "";
			const filtered = items.filter(it=>{
				const inTitle = (it.title||"").toLowerCase().includes(q);
				const inTags = (it.tags||[]).some(t=> t.toLowerCase().includes(q));
				return q ? (inTitle || inTags) : true;
			});
			if(filtered.length === 0){
				const li = document.createElement("li");
				li.className = "text-muted";
				li.textContent = q ? "无匹配结果。" : "暂无链接，添加你的第一个文档吧。";
				list.appendChild(li);
			} else {
				filtered.forEach((it)=>{
					const li = document.createElement("li");
					li.className = "d-flex flex-column gap-1 py-1";
					const row = document.createElement("div");
					row.className = "d-flex align-items-center justify-content-between gap-2";
					const a = document.createElement("a");
					a.href = it.url;
					a.target = "_blank";
					a.rel = "noreferrer noopener";
					a.textContent = it.title || it.url;
					a.className = "link-primary text-decoration-none";
					const btns = document.createElement("div");
					btns.className = "d-flex align-items-center gap-2";
					const del = document.createElement("button");
					del.className = "btn btn-link btn-sm text-danger text-decoration-none";
					del.type = "button";
					del.textContent = "删除";
					del.addEventListener("click", ()=>{
						const original = readLinks();
						const indexInOriginal = original.findIndex(x=> x.url===it.url && x.title===it.title);
						if(indexInOriginal>-1){
							original.splice(indexInOriginal,1);
							writeLinks(original);
							renderLinks();
						}
					});
					btns.appendChild(del);
					row.appendChild(a);
					row.appendChild(btns);
					li.appendChild(row);
					if ((it.tags||[]).length){
						const tagsWrap = document.createElement("div");
						tagsWrap.className = "d-flex flex-wrap gap-1";
						it.tags.forEach(t=>{
							const tag = document.createElement("span");
							tag.className = "badge text-bg-light text-secondary";
							tag.textContent = t;
							tagsWrap.appendChild(tag);
						});
						li.appendChild(tagsWrap);
					}
					list.appendChild(li);
				});
			}
		}
		// 底部跑马灯
		buildTickerContent(items);
	}

	renderLinks();
	searchInput?.addEventListener("input", renderLinks);

	if (form && titleInput && urlInput) {
		form.addEventListener("submit", function(e){
			e.preventDefault();
			const title = titleInput.value.trim();
			const url = urlInput.value.trim();
			const tags = normalizeTags(tagsInput?.value);
			if (!title || !url || !isValidUrl(url)) {
				form.classList.add("was-validated");
				return;
			}
			const items = readLinks();
			items.unshift({ title, url, tags });
			writeLinks(items);
			titleInput.value = "";
			urlInput.value = "";
			if(tagsInput) tagsInput.value = "";
			form.classList.remove("was-validated");
			renderLinks();
		});
	}
})();
